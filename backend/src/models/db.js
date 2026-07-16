/**
 * db.js — Capa de persistencia en archivos JSON
 *
 * Simula una base de datos usando archivos .json en /data.
 * Cada colección es un archivo separado.
 *
 * Colecciones:
 *   usuarios.json        → cuentas de usuario (email, hash de contraseña)
 *   entrenamientos.json  → todos los datos de entrenamiento por userId
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

// Crear el directorio /data si no existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Lee una colección JSON. Si no existe, la crea vacía.
 * @param {string} coleccion - nombre sin extensión
 * @returns {Array}
 */
function leer(coleccion) {
  const file = path.join(DATA_DIR, `${coleccion}.json`);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
    return [];
  }
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

/**
 * Reemplaza el contenido de una colección.
 * @param {string} coleccion
 * @param {Array}  datos
 */
function escribir(coleccion, datos) {
  const file = path.join(DATA_DIR, `${coleccion}.json`);
  fs.writeFileSync(file, JSON.stringify(datos, null, 2));
}

module.exports = { leer, escribir };
