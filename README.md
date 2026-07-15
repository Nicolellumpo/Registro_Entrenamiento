# 🏋️ GymTracker — Registro de Entrenamiento

App web fullstack para registrar entrenamientos diarios con autenticación por usuario.
Cada persona ve **solo sus propios datos** desde cualquier dispositivo.

**Demo:** [nicolellumpo.github.io/Registro_Entrenamiento](https://nicolellumpo.github.io/Registro_Entrenamiento)  

---

---

## Estructura del proyecto

```
Registro_Entrenamiento/
│
├── frontend/
│   ├── index.html              ← estructura y pantallas (HTML puro)
│   ├── gym.css                 ← variables, layout, componentes
│   └── gym.js                  ← lógica, fetch al backend, localStorage
│
├── backend/
│   ├── src/
│   │   ├── index.js                    ← servidor Express + rutas
│   │   ├── routes/
│   │   │   ├── auth.js                 ← registro, login, me
│   │   │   ├── datos.js                ← datos de entrenamiento
│   │   │   └── chat.js                 ← asistente IA
│   │   ├── controllers/
│   │   │   ├── authController.js       ← bcrypt + JWT
│   │   │   ├── datosController.js      ← CRUD por userId
│   │   │   └── chatController.js       ← proxy seguro a Anthropic
│   │   ├── middleware/
│   │   │   └── verificarToken.js       ← valida JWT en cada request
│   │   └── models/
│   │       └── db.js                   ← leer/escribir JSON
│   ├── data/                           ← generado al correr (en .gitignore)
│   │   ├── usuarios.json
│   │   └── entrenamientos.json
│   └── package.json
│
├── render.yaml                 ← configuración de deploy en Render
├── .gitignore
└── README.md
```

---

## Funcionalidades

| Pantalla | Qué hace |
|---|---|
| **Hoy** | Registra grupo muscular, energía, fatiga, progresión, sueño, molestias y notas |
| **Cardio** | Minutos caminando / corriendo / bici + pulsaciones + resumen semanal |
| **Ejercicios** | Peso usado, kg totales, series y progresión por mes con barras visuales |
| **Asistencia** | Grilla mensual ✅/❌ para gym y cardio por separado |
| **Historial** | Todos los registros filtrados por mes con badges de estado |
| **Rutina** | Rutina semanal completa consultable offline |
| **Asistente** | Chat con IA especializada en entrenamiento con pesas (GymBot) |

---

## Correr en local

```bash
# Terminal 1 — backend
cd backend
npm install
npm run dev        # levanta en localhost:3001

# Terminal 2 — frontend
# Abrí frontend/index.html con Live Server de VSCode
```
---

## Deploy

### Backend → Render
1. [render.com](https://render.com) → New Web Service → conectar este repo
2. Render detecta `render.yaml` automáticamente
3. En Environment → agregar `ANTHROPIC_API_KEY` con tu key real
4. Deploy → obtenés la URL: `https://gymtracker-api-XXX.onrender.com`

### Frontend → GitHub Pages
1. En `frontend/logicaGymtracker.js` línea ~685, reemplazá la URL de Render por la tuya
2. Settings → Pages → Branch: main → Folder: /frontend

---

## Conceptos aplicados

```
Backend:
✔ Arquitectura MVC (routes / controllers / middleware / models)
✔ Autenticación JWT — generación, verificación, expiración (7 días)
✔ Hash de contraseñas con bcrypt (salt rounds = 10)
✔ Proxy seguro a API externa — la key nunca sale del servidor
✔ Middleware de protección aplicado a nivel de router
✔ Separación de datos por userId (multiusuario real)
✔ Variables de entorno para secretos

Frontend:
✔ Separación en 3 archivos: HTML / CSS / JS
✔ CSS Variables para theming completo
✔ Fetch API con JWT en Authorization header
✔ Detección automática local vs producción
✔ SPA sin frameworks — renderizado dinámico puro JS
✔ Logout automático si el token expira (401)
```

---

> Desarrollado por **Nicole Llumpo** — Ingeniería en Sistemas de Información, UTN · Buenos Aires 2026
