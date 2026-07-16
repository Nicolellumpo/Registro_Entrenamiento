/**
 * datos.js — Rutas de datos de entrenamiento
 *
 * Todas protegidas con verificarToken aplicado al router completo.
 * Orden importante: la ruta específica /asistencia/toggle debe ir
 * ANTES de /:tipo para que Express no la confunda con un parámetro.
 */

const express        = require('express');
const router         = express.Router();
const ctrl           = require('../controllers/datosController');
const verificarToken = require('../middleware/verificarToken');

// Proteger todas las rutas de este router
router.use(verificarToken);

router.get('/todo',                  ctrl.todo);
router.post('/asistencia/toggle',    ctrl.toggleAsistencia);
router.get('/:tipo',                 ctrl.obtener);
router.post('/:tipo',                ctrl.guardar);
router.delete('/:tipo/:fecha',       ctrl.eliminar);
router.put('/perfil',                ctrl.actualizarPerfil);

module.exports = router;
