/**
 * chat.js — Ruta del asistente de IA
 *
 * Protegida con verificarToken: solo usuarios logueados
 * pueden usar el asistente, evitando abuso de la API key.
 */

const express        = require('express');
const router         = express.Router();
const { chat }       = require('../controllers/chatController');
const verificarToken = require('../middleware/verificarToken');

router.post('/', verificarToken, chat);

module.exports = router;
