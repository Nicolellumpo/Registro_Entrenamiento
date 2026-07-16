/**
 * authController.js — Lógica de registro y login
 *
 * REGISTRO:
 *   1. Valida campos obligatorios
 *   2. Verifica que el email no exista
 *   3. Hashea la contraseña con bcrypt (salt rounds = 10)
 *   4. Guarda el usuario en usuarios.json
 *   5. Genera JWT y lo devuelve
 *
 * LOGIN:
 *   1. Busca el usuario por email
 *   2. Compara contraseña con hash usando bcrypt.compare
 *   3. Si coincide → genera JWT y lo devuelve
 *   4. Mismo mensaje de error para email y contraseña incorrectos
 *      (para no revelar cuáles emails están registrados)
 */

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db     = require('../models/db');

const SECRET  = process.env.JWT_SECRET || 'gymtracker_secret_dev_2026';
const EXPIRES = '7d';

// ── POST /api/auth/registro ───────────────────────────────
const registro = async (req, res) => {
  try {
    const { nombre, email, password, peso, altura, objetivo } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ ok: false, mensaje: 'Nombre, email y contraseña son obligatorios.' });

    if (password.length < 6)
      return res.status(400).json({ ok: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ ok: false, mensaje: 'El email no es válido.' });

    const usuarios = db.leer('usuarios');
    if (usuarios.find(u => u.email === email.toLowerCase()))
      return res.status(409).json({ ok: false, mensaje: 'Ese email ya está registrado.' });

    // bcrypt hashea la contraseña — nunca se guarda en texto plano
    const hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = {
      id:        uuidv4(),
      nombre:    nombre.trim(),
      email:     email.toLowerCase().trim(),
      password:  hash,
      perfil: {
        peso:     peso     || null,
        altura:   altura   || null,
        objetivo: objetivo || '',
      },
      creadoEn: new Date().toISOString(),
    };

    usuarios.push(nuevoUsuario);
    db.escribir('usuarios', usuarios);

    const token = jwt.sign(
      { userId: nuevoUsuario.id, email: nuevoUsuario.email, nombre: nuevoUsuario.nombre },
      SECRET,
      { expiresIn: EXPIRES }
    );

    return res.status(201).json({
      ok:      true,
      mensaje: `¡Bienvenida, ${nuevoUsuario.nombre}!`,
      token,
      usuario: {
        id:     nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email:  nuevoUsuario.email,
        perfil: nuevoUsuario.perfil,
      },
    });

  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
};

// ── POST /api/auth/login ──────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ ok: false, mensaje: 'Email y contraseña son obligatorios.' });

    const usuarios = db.leer('usuarios');
    const usuario  = usuarios.find(u => u.email === email.toLowerCase().trim());

    if (!usuario)
      return res.status(401).json({ ok: false, mensaje: 'Email o contraseña incorrectos.' });

    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk)
      return res.status(401).json({ ok: false, mensaje: 'Email o contraseña incorrectos.' });

    const token = jwt.sign(
      { userId: usuario.id, email: usuario.email, nombre: usuario.nombre },
      SECRET,
      { expiresIn: EXPIRES }
    );

    return res.json({
      ok:      true,
      mensaje: `¡Hola de nuevo, ${usuario.nombre}!`,
      token,
      usuario: {
        id:     usuario.id,
        nombre: usuario.nombre,
        email:  usuario.email,
        perfil: usuario.perfil,
      },
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────
// Ruta protegida — verifica si el token sigue siendo válido
const me = (req, res) => {
  const usuarios = db.leer('usuarios');
  const usuario  = usuarios.find(u => u.id === req.usuario.userId);
  if (!usuario)
    return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });

  return res.json({
    ok: true,
    usuario: {
      id:     usuario.id,
      nombre: usuario.nombre,
      email:  usuario.email,
      perfil: usuario.perfil,
    },
  });
};

module.exports = { registro, login, me };
