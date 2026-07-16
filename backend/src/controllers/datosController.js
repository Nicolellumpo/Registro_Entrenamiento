/**
 * datosController.js — Lógica de datos de entrenamiento
 *
 * Todos los métodos filtran por req.usuario.userId
 * para que cada usuario vea SOLO sus propios datos.
 *
 * Estructura de entrenamientos.json:
 * [
 *   {
 *     userId: "abc-123",
 *     tipo:   "registro" | "cardio" | "ejercicio" | "asistencia",
 *     fecha:  "2026-06-01",
 *     datos:  { ... }
 *   }
 * ]
 */

const db = require('../models/db');

// ── GET /api/datos/:tipo ──────────────────────────────────
const obtener = (req, res) => {
  try {
    const { tipo } = req.params;
    const tiposValidos = ['registro', 'cardio', 'ejercicio', 'asistencia'];
    if (!tiposValidos.includes(tipo))
      return res.status(400).json({ ok: false, mensaje: `Tipo inválido. Usá: ${tiposValidos.join(', ')}` });

    const todos = db.leer('entrenamientos');
    const datos = todos.filter(e => e.userId === req.usuario.userId && e.tipo === tipo);
    return res.json({ ok: true, datos });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener datos.' });
  }
};

// ── GET /api/datos/todo ───────────────────────────────────
const todo = (req, res) => {
  try {
    const todos = db.leer('entrenamientos');
    const datos = todos.filter(e => e.userId === req.usuario.userId);
    return res.json({ ok: true, datos });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener datos.' });
  }
};

// ── POST /api/datos/:tipo ─────────────────────────────────
// Upsert: reemplaza si ya existe registro para esa fecha y tipo
const guardar = (req, res) => {
  try {
    const { tipo }       = req.params;
    const { fecha, datos } = req.body;

    if (!fecha || !datos)
      return res.status(400).json({ ok: false, mensaje: 'fecha y datos son obligatorios.' });

    const todos = db.leer('entrenamientos');
    const idx   = todos.findIndex(e =>
      e.userId === req.usuario.userId && e.tipo === tipo && e.fecha === fecha
    );

    const entry = {
      userId:        req.usuario.userId,
      tipo,
      fecha,
      datos,
      actualizadoEn: new Date().toISOString(),
    };

    if (idx > -1) todos[idx] = entry;
    else          todos.push(entry);

    db.escribir('entrenamientos', todos);
    return res.json({ ok: true, mensaje: 'Guardado correctamente.', entry });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al guardar datos.' });
  }
};

// ── POST /api/datos/asistencia/toggle ────────────────────
const toggleAsistencia = (req, res) => {
  try {
    const { subtipo, mes, anio, dia } = req.body;
    if (!subtipo || mes === undefined || !anio || !dia)
      return res.status(400).json({ ok: false, mensaje: 'subtipo, mes, anio y dia son obligatorios.' });

    const todos = db.leer('entrenamientos');
    const idx   = todos.findIndex(e =>
      e.userId === req.usuario.userId &&
      e.tipo   === 'asistencia' &&
      e.datos?.subtipo === subtipo &&
      e.datos?.mes  === mes &&
      e.datos?.anio === anio
    );

    let entry;
    if (idx > -1) {
      entry = todos[idx];
    } else {
      entry = {
        userId: req.usuario.userId,
        tipo:   'asistencia',
        fecha:  `${anio}-${String(mes + 1).padStart(2, '0')}-01`,
        datos:  { subtipo, mes, anio, dias: {} },
      };
      todos.push(entry);
    }

    const cur = entry.datos.dias[dia];
    if (!cur)             entry.datos.dias[dia] = 'fue';
    else if (cur === 'fue') entry.datos.dias[dia] = 'falto';
    else                  delete entry.datos.dias[dia];

    entry.actualizadoEn = new Date().toISOString();
    if (idx > -1) todos[idx] = entry;

    db.escribir('entrenamientos', todos);
    return res.json({ ok: true, datos: entry.datos });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar asistencia.' });
  }
};

// ── DELETE /api/datos/:tipo/:fecha ────────────────────────
const eliminar = (req, res) => {
  try {
    const { tipo, fecha } = req.params;
    const todos  = db.leer('entrenamientos');
    const nuevos = todos.filter(e =>
      !(e.userId === req.usuario.userId && e.tipo === tipo && e.fecha === fecha)
    );
    db.escribir('entrenamientos', nuevos);
    return res.json({ ok: true, mensaje: 'Registro eliminado.' });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar.' });
  }
};

// ── PUT /api/datos/perfil ─────────────────────────────────
const actualizarPerfil = (req, res) => {
  try {
    const { peso, altura, objetivo } = req.body;
    const usuarios = db.leer('usuarios');
    const idx      = usuarios.findIndex(u => u.id === req.usuario.userId);
    if (idx === -1)
      return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });

    if (peso     !== undefined) usuarios[idx].perfil.peso     = peso;
    if (altura   !== undefined) usuarios[idx].perfil.altura   = altura;
    if (objetivo !== undefined) usuarios[idx].perfil.objetivo = objetivo;

    db.escribir('usuarios', usuarios);
    return res.json({ ok: true, perfil: usuarios[idx].perfil });
  } catch (err) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar perfil.' });
  }
};

module.exports = { obtener, todo, guardar, toggleAsistencia, eliminar, actualizarPerfil };
