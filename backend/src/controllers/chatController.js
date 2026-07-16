/**
 * chatController.js — Proxy seguro entre el frontend y Anthropic
 *
 * ¿Por qué existe?
 * El repo es público → la API key NO puede estar en el frontend.
 * Este controller recibe la pregunta del usuario, llama a Claude
 * con la key que vive en process.env, y devuelve solo el texto.
 * La key NUNCA llega al navegador.
 *
 * La ruta está protegida con verificarToken:
 * solo usuarios logueados pueden usar el asistente.
 */

const SYSTEM_PROMPT = `Sos una asistente especializada en entrenamiento con pesas y fitness.
Tu nombre es GymBot. Respondés preguntas sobre:
- Diferencias entre ejercicios y sus variantes (convencional vs rumano, barra vs mancuernas, etc.)
- Grupos musculares que trabaja cada ejercicio
- Técnica correcta de ejecución
- Cuándo elegir una variante sobre otra
- Manejo de cargas y progresión de peso
- Lesiones comunes y cómo prevenirlas

Hablás en español argentino, de forma clara, directa y sin rodeos.
Usás negritas (**texto**) para resaltar los puntos clave.
Usás cursiva (*texto*) para nombres técnicos de músculos.
Tus respuestas son concretas: máximo 4-6 oraciones por punto.
Si la pregunta no tiene nada que ver con ejercicios, pesos o fitness,
respondés amablemente que solo podés ayudar con eso.`;

// ── POST /api/chat ────────────────────────────────────────
const chat = async (req, res) => {
  try {
    const { mensajes } = req.body;

    if (!mensajes || !Array.isArray(mensajes) || mensajes.length === 0)
      return res.status(400).json({ ok: false, mensaje: '"mensajes" es obligatorio y debe ser un array.' });

    // Limitar historial para no gastar tokens innecesarios
    const mensajesLimitados = mensajes.slice(-20);

    const formatoValido = mensajesLimitados.every(m => m.role && typeof m.content === 'string');
    if (!formatoValido)
      return res.status(400).json({ ok: false, mensaje: 'Cada mensaje necesita "role" y "content".' });

    // La key viene de la variable de entorno — nunca del código
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY no está configurada.');
      return res.status(500).json({ ok: false, mensaje: 'El servidor no tiene configurada la API key.' });
    }

    const respuestaAnthropic = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,   // ← solo acá, en el servidor
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 1000,
        system:     SYSTEM_PROMPT,
        messages:   mensajesLimitados,
      }),
    });

    const datos = await respuestaAnthropic.json();

    if (!respuestaAnthropic.ok) {
      console.error('Error de Anthropic:', datos);
      return res.status(502).json({ ok: false, mensaje: 'Error al comunicarse con el servicio de IA.' });
    }

    return res.json({ ok: true, respuesta: datos.content[0].text });

  } catch (err) {
    console.error('Error en chatController:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
};

module.exports = { chat };
