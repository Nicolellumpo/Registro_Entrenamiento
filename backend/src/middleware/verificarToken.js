/**
 * verificarToken.js — Middleware de autenticación JWT
 *
 * Extrae el token del header Authorization: Bearer <token>
 * Lo verifica con la clave secreta.
 * Si es válido → adjunta req.usuario = { userId, email, nombre }
 * Si no → responde 401 y corta la cadena de middlewares.
 *
 * Se aplica en todas las rutas protegidas con router.use(verificarToken).
 */

const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'gymtracker_secret_dev_2026';

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      ok:      false,
      mensaje: 'Token requerido. Iniciá sesión para continuar.',
    });
  }

  try {
    const payload  = jwt.verify(token, SECRET);
    req.usuario    = payload; // { userId, email, nombre }
    next();
  } catch (err) {
    const mensaje = err.name === 'TokenExpiredError'
      ? 'Tu sesión expiró. Volvé a iniciar sesión.'
      : 'Token inválido.';
    return res.status(401).json({ ok: false, mensaje });
  }
}

module.exports = verificarToken;
