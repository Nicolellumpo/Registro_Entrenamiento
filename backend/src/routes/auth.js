/**
 * auth.js — Rutas de autenticación
 *
 * Públicas (sin token):
 *   POST /api/auth/registro
 *   POST /api/auth/login
 *
 * Protegida (con token):
 *   GET  /api/auth/me
 */

const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/authController');
const verificarToken = require('../middleware/verificarToken');

router.post('/registro', ctrl.registro);
router.post('/login',    ctrl.login);
router.get('/me',        verificarToken, ctrl.me);

module.exports = router;
