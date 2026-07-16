/**
 * index.js — Entry point del servidor Express
 *
 * Rutas disponibles:
 *   /api/auth/*  → registro, login, me (públicas)
 *   /api/datos/* → datos de entrenamiento (protegidas con JWT)
 *   /api/chat    → proxy a Anthropic (protegida con JWT)
 *
 * La ANTHROPIC_API_KEY vive SOLO en la variable de entorno de Render.
 * Nunca está en el código fuente.
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const authRouter  = require('./routes/auth');
const datosRouter = require('./routes/datos');
const chatRouter  = require('./routes/chat');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware global ─────────────────────────────────────
app.use(cors({
  origin: '*', // En producción: 'https://nicolellumpo.github.io'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ── Rutas ─────────────────────────────────────────────────
app.use('/api/auth',  authRouter);
app.use('/api/datos', datosRouter);
app.use('/api/chat',  chatRouter);

// ── Info ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    nombre:  'GymTracker API',
    version: '2.1.0',
    autor:   'Nicole Llumpo',
    rutas: {
      registro: 'POST /api/auth/registro',
      login:    'POST /api/auth/login',
      me:       'GET  /api/auth/me          [token]',
      datos:    'GET|POST /api/datos/:tipo  [token]',
      asist:    'POST /api/datos/asistencia/toggle [token]',
      chat:     'POST /api/chat             [token]',
    },
  });
});

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: `Ruta no encontrada: ${req.method} ${req.path}` });
});

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║     GYMTRACKER API  v2.1.0           ║');
  console.log('  ╠══════════════════════════════════════╣');
  console.log(`  ║  http://localhost:${PORT}                ║`);
  console.log('  ║  Auth : JWT + bcrypt                 ║');
  console.log('  ║  Chat : Anthropic API (proxy seguro) ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
