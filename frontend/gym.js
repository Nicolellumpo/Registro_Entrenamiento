// ══════════════════════════════════════════════════════════
// logicaGymtracker.js
// Lógica completa de la app GymTracker 2026
// Autora: Nicole Llumpo
// ══════════════════════════════════════════════════════════

// ── Constantes de datos ───────────────────────────────────
const NOMBRES_MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

const NOMBRES_DIAS = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

const DATOS_RUTINA = [
  {
    dia: 'LUNES', grupo: 'ISQUIOS · GLÚTEOS', claseColor: 'lunes',
    ejercicios: [
      { nombre: 'Serie movilidad',                      series: '5-10 min' },
      { nombre: 'Hip Thrust libre',                     series: '4×10' },
      { nombre: 'Peso muerto convencional',             series: '4×10' },
      { nombre: 'Sentadilla búlgara',                   series: '4×10' },
      { nombre: 'Patada de glúteos',                    series: '4×10' },
      { nombre: 'Máquina abductores (cerrado-glúteos)', series: '4×10' },
      { nombre: 'Máquina de isquios',                   series: '4×10' },
      { nombre: 'Cinta',                                series: '5-10 min' },
    ]
  },
  {
    dia: 'MARTES', grupo: 'ESPALDA · BÍCEPS · ABDOMEN', claseColor: 'martes',
    ejercicios: [
      { nombre: 'Dorsalera pecho agarre abierto', series: '4×10' },
      { nombre: 'Remo bajo con cable',            series: '4×10' },
      { nombre: 'Pullover',                       series: '4×10' },
      { nombre: 'Remo con mancuerna',             series: '4×10' },
      { nombre: 'Curl martillo',                  series: '4×10' },
      { nombre: 'Serie abdominales',              series: '—' },
      { nombre: 'Cinta',                          series: '5-10 min' },
    ]
  },
  {
    dia: 'MIÉRCOLES', grupo: 'CUADRICEPS · GLÚTEOS', claseColor: 'miercoles',
    ejercicios: [
      { nombre: 'Serie movilidad',                          series: '5-10 min' },
      { nombre: 'Sentadilla en Smith',                      series: '4×10' },
      { nombre: 'Sentadilla goblet mancuerna',              series: '4×10' },
      { nombre: 'Sillón de cuadriceps + mantengo + cortas', series: '4×10' },
      { nombre: 'Prensa (medio-bajo-cerrado)',               series: '4×10' },
      { nombre: 'Aductores en máquina (abierto)',            series: '4×15' },
      { nombre: 'Cinta',                                    series: '5-10 min' },
    ]
  },
  {
    dia: 'JUEVES', grupo: 'PECHO · TRÍCEPS · HOMBRO', claseColor: 'jueves',
    ejercicios: [
      { nombre: 'Aperturas Peck Deck',         series: '3×10' },
      { nombre: 'Press de banca con barra',    series: '4×10' },
      { nombre: 'Banco inclinado',             series: '4×10' },
      { nombre: 'Press de hombros con mancuerna', series: '4×10' },
      { nombre: 'Vuelos laterales',            series: '4×10' },
      { nombre: 'Tríceps pushdown en polea',   series: '4×10' },
      { nombre: 'Serie abdominales',           series: '—' },
      { nombre: 'Cinta',                       series: '5-10 min' },
    ]
  },
  {
    dia: 'VIERNES', grupo: 'LEGS DAY', claseColor: 'viernes',
    ejercicios: [
      { nombre: 'Serie movilidad',                    series: '5-10 min' },
      { nombre: 'Hip Thrust en máquina',              series: '10 completas + 10 mantengo + 10 cortas' },
      { nombre: 'Peso muerto + unilateral mancuerna', series: '4×10' },
      { nombre: 'Sentadilla sumo',                    series: '4×12' },
      { nombre: 'Abductores',                         series: '—' },
      { nombre: 'Cinta',                              series: '5-10 min' },
    ]
  },
];

// ── Estado de la aplicación ───────────────────────────────
let estadoRegistroDiario = {
  energia:   0,
  fatiga:    '',
  sensacion: '',
  progresion:'',
  sueno:     '',
  molestias: '',
};

let mesFiltroHistorial  = new Date().getMonth();
let mesFiltroEjercicios = new Date().getMonth();
let mesFiltroAsistencia = new Date().getMonth();

// ── LocalStorage ──────────────────────────────────────────

function obtenerDeStorage(clave) {
  try { return JSON.parse(localStorage.getItem(clave)) || []; }
  catch { return []; }
}

function guardarEnStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// ── Navegación entre pantallas ────────────────────────────

function setScreen(idPantalla) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  document.querySelectorAll('.pestaniaNav').forEach(t => t.classList.remove('activa'));

  document.getElementById('pantalla-' + idPantalla).classList.add('activa');
  document.querySelector(`.pestaniaNav[onclick="setScreen('${idPantalla}')"]`).classList.add('activa');

  if (idPantalla === 'hoy')         inicializarPantallaHoy();
  if (idPantalla === 'cardio')      inicializarPantallaCardio();
  if (idPantalla === 'ejercicios')  inicializarPantallaEjercicios();
  if (idPantalla === 'asistencia')  inicializarPantallaAsistencia();
  if (idPantalla === 'historial')   inicializarPantallaHistorial();
  if (idPantalla === 'rutina')      inicializarPantallaRutina();
  if (idPantalla === 'asistente')  inicializarPantallaAsistente();
}

// ── Toast de notificaciones ───────────────────────────────

function mostrarToast(mensaje, esError = false) {
  const contenedor = document.getElementById('contenedorToast');
  contenedor.textContent = mensaje;
  contenedor.className   = 'visible' + (esError ? ' error' : '');
  setTimeout(() => contenedor.className = '', 2500);
}

// ── Utilidades de fecha ───────────────────────────────────

function obtenerFechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

function obtenerDiaDeSemana(fecha) {
  // Lun=0 .. Dom=6
  return (fecha.getDay() + 6) % 7;
}

function obtenerSemanaDelMes(fecha) {
  const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
  const offsetPrimerDia = obtenerDiaDeSemana(primerDia);
  return Math.ceil((fecha.getDate() + offsetPrimerDia) / 7);
}

// ── HOY: inicialización y manejo de fecha ─────────────────

function inicializarPantallaHoy() {
  const inputFecha = document.getElementById('inputFechaHoy');
  if (!inputFecha.value) inputFecha.value = obtenerFechaHoy();
  actualizarFechaHoy();
  renderizarEstadisticasHoy();
}

function actualizarFechaHoy() {
  const valorFecha = document.getElementById('inputFechaHoy').value || obtenerFechaHoy();
  const fecha      = new Date(valorFecha + 'T12:00:00');

  document.getElementById('tituloDiaHoy').textContent   = NOMBRES_DIAS[obtenerDiaDeSemana(fecha)];
  document.getElementById('fechaLegibleHoy').textContent =
    fecha.getDate() + ' de ' + NOMBRES_MESES[fecha.getMonth()] + ' ' + fecha.getFullYear();
  document.getElementById('etiquetaMesActual').textContent = NOMBRES_MESES[fecha.getMonth()];
  renderizarEstadisticasHoy();
}

// ── HOY: selección de energía con estrellas ───────────────

function setStar(numero) {
  estadoRegistroDiario.energia = numero;
  document.querySelectorAll('#contenedorEstrellaEnergia .estrella').forEach((estrella, indice) => {
    estrella.classList.toggle('activa', indice < numero);
  });
}

// ── HOY: selección de pills ───────────────────────────────

function togglePill(elementoPill, campo, valor) {
  elementoPill.closest('.grupoPills').querySelectorAll('.pill').forEach(p => {
    p.classList.remove('seleccionada');
  });
  elementoPill.classList.add('seleccionada');
  estadoRegistroDiario[campo] = valor;
}

// ── HOY: guardar registro ─────────────────────────────────

function guardarRegistro() {
  const valorFecha   = document.getElementById('inputFechaHoy').value || obtenerFechaHoy();
  const grupoMuscular = document.getElementById('selectGrupoMuscular').value;
  const notas        = document.getElementById('textareaNotasHoy').value.trim();

  if (!grupoMuscular)                  return mostrarToast('Seleccioná el grupo muscular', true);
  if (!estadoRegistroDiario.energia)   return mostrarToast('Seleccioná la energía', true);
  if (!estadoRegistroDiario.fatiga)    return mostrarToast('Seleccioná la fatiga', true);
  if (!estadoRegistroDiario.sensacion) return mostrarToast('Seleccioná la sensación', true);
  if (!estadoRegistroDiario.progresion) return mostrarToast('Seleccioná la progresión', true);
  if (!estadoRegistroDiario.sueno)     return mostrarToast('Seleccioná el sueño', true);
  if (!estadoRegistroDiario.molestias) return mostrarToast('Seleccioná molestias', true);

  const registros   = obtenerDeStorage('registros');
  const indiceExistente = registros.findIndex(r => r.fecha === valorFecha);
  const nuevoRegistro   = { fecha: valorFecha, grupoMuscular, ...estadoRegistroDiario, notas };

  if (indiceExistente > -1) registros[indiceExistente] = nuevoRegistro;
  else registros.push(nuevoRegistro);

  guardarEnStorage('registros', registros);
  mostrarToast('✓ Registro guardado');
  limpiarFormHoy();
  renderizarEstadisticasHoy();
  marcarAsistenciaGymAutomatica(valorFecha, true);
}

function limpiarFormHoy() {
  document.getElementById('selectGrupoMuscular').value = '';
  document.getElementById('textareaNotasHoy').value    = '';
  estadoRegistroDiario = { energia:0, fatiga:'', sensacion:'', progresion:'', sueno:'', molestias:'' };
  document.querySelectorAll('.estrella').forEach(e => e.classList.remove('activa'));
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('seleccionada'));
}

// ── HOY: estadísticas del mes ─────────────────────────────

function renderizarEstadisticasHoy() {
  const valorFecha  = document.getElementById('inputFechaHoy')?.value || obtenerFechaHoy();
  const mesActual   = new Date(valorFecha + 'T12:00:00').getMonth();
  const registros   = obtenerDeStorage('registros')
    .filter(r => new Date(r.fecha + 'T12:00:00').getMonth() === mesActual);

  const totalEntrenos   = registros.length;
  const promedioEnergia = totalEntrenos
    ? (registros.reduce((acum, r) => acum + r.energia, 0) / totalEntrenos).toFixed(1)
    : '—';
  const countFatigaAlta  = registros.filter(r => r.fatiga === 'Alta').length;
  const countSubioPeso   = registros.filter(r => r.progresion === 'Subí peso').length;

  document.getElementById('tiraEstadisticasHoy').innerHTML = `
    <div class="tarjetaEstadistica">
      <div class="valorEstadistica lima">${totalEntrenos}</div>
      <div class="etiquetaEstadistica">Entrenos</div>
    </div>
    <div class="tarjetaEstadistica">
      <div class="valorEstadistica azul">${promedioEnergia}</div>
      <div class="etiquetaEstadistica">Energía ⌀</div>
    </div>
    <div class="tarjetaEstadistica">
      <div class="valorEstadistica rojo">${countFatigaAlta}</div>
      <div class="etiquetaEstadistica">Fatiga Alta</div>
    </div>
    <div class="tarjetaEstadistica">
      <div class="valorEstadistica naranja">${countSubioPeso}</div>
      <div class="etiquetaEstadistica">Subí peso</div>
    </div>`;
}

// ── CARDIO: inicialización ────────────────────────────────

function inicializarPantallaCardio() {
  const inputFecha = document.getElementById('inputFechaCardio');
  if (!inputFecha.value) inputFecha.value = obtenerFechaHoy();
  actualizarFechaCardio();

  ['inputMinCaminando', 'inputMinCorriendo', 'inputMinBicicleta'].forEach(id => {
    document.getElementById(id).oninput = calcularTotalMinutosCardio;
  });
}

function actualizarFechaCardio() {
  const valorFecha = document.getElementById('inputFechaCardio').value || obtenerFechaHoy();
  const fecha      = new Date(valorFecha + 'T12:00:00');

  document.getElementById('tituloDiaCardio').textContent   = NOMBRES_DIAS[obtenerDiaDeSemana(fecha)].toUpperCase();
  document.getElementById('fechaLegibleCardio').textContent =
    fecha.getDate() + ' de ' + NOMBRES_MESES[fecha.getMonth()] + ' ' + fecha.getFullYear();

  renderizarSemanaCardio(valorFecha);
  renderizarEstadisticasCardioMes(fecha.getMonth());
}

function calcularTotalMinutosCardio() {
  const minCaminando = parseFloat(document.getElementById('inputMinCaminando').value) || 0;
  const minCorriendo = parseFloat(document.getElementById('inputMinCorriendo').value) || 0;
  const minBicicleta = parseFloat(document.getElementById('inputMinBicicleta').value) || 0;
  document.getElementById('inputMinTotalesCardio').value = minCaminando + minCorriendo + minBicicleta;
}

// ── CARDIO: guardar ───────────────────────────────────────

function guardarCardio() {
  const valorFecha   = document.getElementById('inputFechaCardio').value || obtenerFechaHoy();
  const minCaminando = parseFloat(document.getElementById('inputMinCaminando').value) || 0;
  const minCorriendo = parseFloat(document.getElementById('inputMinCorriendo').value) || 0;
  const minBicicleta = parseFloat(document.getElementById('inputMinBicicleta').value) || 0;
  const hzCaminando  = parseFloat(document.getElementById('inputHzCaminando').value) || 0;
  const hzCorriendo  = parseFloat(document.getElementById('inputHzCorriendo').value) || 0;
  const totalMinutos = minCaminando + minCorriendo + minBicicleta;

  const sesiones    = obtenerDeStorage('cardios');
  const indice      = sesiones.findIndex(s => s.fecha === valorFecha);
  const nuevaSesion = { fecha: valorFecha, minCaminando, minCorriendo, minBicicleta, hzCaminando, hzCorriendo, totalMinutos };

  if (indice > -1) sesiones[indice] = nuevaSesion;
  else sesiones.push(nuevaSesion);

  guardarEnStorage('cardios', sesiones);
  mostrarToast('✓ Cardio guardado');
  limpiarCardio();
  marcarAsistenciaCardioAutomatica(valorFecha, totalMinutos > 0);
  actualizarFechaCardio();
}

function limpiarCardio() {
  ['inputMinCaminando','inputMinCorriendo','inputMinBicicleta',
   'inputHzCaminando','inputHzCorriendo','inputMinTotalesCardio'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

// ── CARDIO: renderizar semana ─────────────────────────────

function renderizarSemanaCardio(valorFecha) {
  const fecha       = new Date(valorFecha + 'T12:00:00');
  const diaSemana   = obtenerDiaDeSemana(fecha);
  const lunesSemana = new Date(fecha);
  lunesSemana.setDate(fecha.getDate() - diaSemana);

  const sesiones    = obtenerDeStorage('cardios');
  let htmlSemana    = '';

  for (let i = 0; i < 7; i++) {
    const diaActual  = new Date(lunesSemana);
    diaActual.setDate(lunesSemana.getDate() + i);
    const claveFecha = diaActual.toISOString().slice(0, 10);
    const sesion     = sesiones.find(s => s.fecha === claveFecha);
    const total      = sesion ? sesion.totalMinutos : 0;
    const esSeleccionado = claveFecha === valorFecha;

    htmlSemana += `
      <div class="diaCardio${esSeleccionado ? ' diaSeleccionado' : ''}">
        <div class="nombreDiaCardio">${NOMBRES_DIAS[i]}</div>
        <div class="totalMinutosCardio">${total > 0 ? total : '—'}</div>
        ${total > 0 ? '<div class="unidadMinutosCardio">min</div>' : ''}
      </div>`;
  }

  document.getElementById('grillaSemanaCardio').innerHTML = htmlSemana;
}

function renderizarEstadisticasCardioMes(mes) {
  const sesiones    = obtenerDeStorage('cardios')
    .filter(s => new Date(s.fecha + 'T12:00:00').getMonth() === mes);
  const totalMinutos   = sesiones.reduce((a, s) => a + s.totalMinutos, 0);
  const totalCaminando = sesiones.reduce((a, s) => a + s.minCaminando, 0);
  const totalCorriendo = sesiones.reduce((a, s) => a + s.minCorriendo, 0);
  const totalBicicleta = sesiones.reduce((a, s) => a + s.minBicicleta, 0);

  document.getElementById('tiraEstadisticasCardioMes').innerHTML = `
    <div class="tarjetaEstadistica"><div class="valorEstadistica azul">${totalMinutos}</div><div class="etiquetaEstadistica">Min totales</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica lima">${totalCaminando}</div><div class="etiquetaEstadistica">Min caminando</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica naranja">${totalCorriendo}</div><div class="etiquetaEstadistica">Min corriendo</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica">${totalBicicleta}</div><div class="etiquetaEstadistica">Min bicicleta</div></div>`;
}

// ── EJERCICIOS: inicialización ────────────────────────────

function inicializarPantallaEjercicios() {
  const inputFecha = document.getElementById('inputFechaEjercicios');
  if (!inputFecha.value) inputFecha.value = obtenerFechaHoy();
  actualizarFechaEj();
  renderizarPestaniasMesEjercicios();
  renderizarProgresionEjercicios();
}

function actualizarFechaEj() {
  const valorFecha = document.getElementById('inputFechaEjercicios').value || obtenerFechaHoy();
  const fecha      = new Date(valorFecha + 'T12:00:00');

  document.getElementById('tituloDiaEjercicios').textContent   = 'SEM ' + obtenerSemanaDelMes(fecha);
  document.getElementById('fechaLegibleEjercicios').textContent =
    NOMBRES_DIAS[obtenerDiaDeSemana(fecha)] + ' ' + fecha.getDate() + ' ' + NOMBRES_MESES[fecha.getMonth()];
  document.getElementById('inputNumeroSemana').value = obtenerSemanaDelMes(fecha);
}

// ── EJERCICIOS: guardar ───────────────────────────────────

function guardarEjercicio() {
  const valorFecha      = document.getElementById('inputFechaEjercicios').value || obtenerFechaHoy();
  const nombreEjercicio = document.getElementById('selectNombreEjercicio').value;
  const descripcionPeso = document.getElementById('inputDescripcionPeso').value.trim();
  const pesoTotalKg     = parseFloat(document.getElementById('inputPesoTotalKg').value) || 0;
  const seriesRep       = document.getElementById('inputSeriesEjercicio').value.trim();
  const numeroSemana    = parseInt(document.getElementById('inputNumeroSemana').value) || 1;

  if (!nombreEjercicio) return mostrarToast('Seleccioná el ejercicio', true);
  if (!descripcionPeso) return mostrarToast('Describí el peso usado', true);

  const ejercicios = obtenerDeStorage('ejercicios');
  ejercicios.push({ fecha: valorFecha, nombreEjercicio, descripcionPeso, pesoTotalKg, seriesRep, numeroSemana });
  guardarEnStorage('ejercicios', ejercicios);
  mostrarToast('✓ Ejercicio guardado');
  limpiarEj();
  renderizarProgresionEjercicios();
}

function limpiarEj() {
  document.getElementById('selectNombreEjercicio').value = '';
  document.getElementById('inputDescripcionPeso').value  = '';
  document.getElementById('inputPesoTotalKg').value      = '';
  document.getElementById('inputSeriesEjercicio').value  = '';
}

// ── EJERCICIOS: pestañas de mes ───────────────────────────

function renderizarPestaniasMesEjercicios() {
  document.getElementById('pestaniasMesEjercicios').innerHTML = NOMBRES_MESES.map((mes, indice) => `
    <button class="pestaniaMes${indice === mesFiltroEjercicios ? ' activa' : ''}"
      onclick="mesFiltroEjercicios=${indice};renderizarPestaniasMesEjercicios();renderizarProgresionEjercicios()">
      ${mes}
    </button>`
  ).join('');
}

// ── EJERCICIOS: progresión por nombre ─────────────────────

function renderizarProgresionEjercicios() {
  const ejercicios = obtenerDeStorage('ejercicios').filter(e =>
    new Date(e.fecha + 'T12:00:00').getMonth() === mesFiltroEjercicios
  );

  if (!ejercicios.length) {
    document.getElementById('contenedorProgresionEjercicios').innerHTML =
      '<div class="mensajeVacio">Sin ejercicios en este mes.</div>';
    return;
  }

  // Agrupar por nombre de ejercicio
  const agrupados = {};
  ejercicios.forEach(e => {
    if (!agrupados[e.nombreEjercicio]) agrupados[e.nombreEjercicio] = [];
    agrupados[e.nombreEjercicio].push(e);
  });

  let htmlProgresion = '';
  Object.entries(agrupados).forEach(([nombre, registros]) => {
    registros.sort((a, b) => a.numeroSemana - b.numeroSemana);
    const pesoMaximo = Math.max(...registros.map(r => r.pesoTotalKg));
    const pesoMinimo = Math.min(...registros.map(r => r.pesoTotalKg));
    const tendencia  = registros.length > 1
      ? (registros[registros.length - 1].pesoTotalKg > registros[0].pesoTotalKg ? '📈'
        : registros[registros.length - 1].pesoTotalKg < registros[0].pesoTotalKg ? '📉' : '➡')
      : '—';

    htmlProgresion += `<div class="seccionEjercicio">
      <div class="nombreEjercicioProgresion">${tendencia} ${nombre}</div>`;

    registros.forEach(r => {
      const porcentaje = pesoMaximo > 0 ? (r.pesoTotalKg / pesoMaximo * 100) : 0;
      htmlProgresion += `
        <div class="wrapperBarraProgreso">
          <div class="cabeceraBarraProgreso">
            <span class="textoBarraProgreso">Sem ${r.numeroSemana} — ${r.descripcionPeso}</span>
            <span class="valorBarraProgreso">${r.pesoTotalKg} kg · ${r.seriesRep}</span>
          </div>
          <div class="pistaBarraProgreso">
            <div class="rellenoBarraProgreso" style="width:${porcentaje}%"></div>
          </div>
        </div>`;
    });

    htmlProgresion += `
      <div class="resumenEjercicio">
        Máx: <span class="valorMaximo">${pesoMaximo} kg</span> ·
        Mín: ${pesoMinimo} kg
      </div>
    </div>`;
  });

  document.getElementById('contenedorProgresionEjercicios').innerHTML = htmlProgresion;
}

// ── ASISTENCIA: inicialización ────────────────────────────

function inicializarPantallaAsistencia() {
  renderizarPestaniasMesAsistencia();
  renderizarGrillasAsistenciaMes();
}

function renderizarPestaniasMesAsistencia() {
  document.getElementById('pestaniasMesAsistencia').innerHTML = NOMBRES_MESES.map((mes, indice) => `
    <button class="pestaniaMes${indice === mesFiltroAsistencia ? ' activa' : ''}"
      onclick="mesFiltroAsistencia=${indice};renderizarPestaniasMesAsistencia();renderizarGrillasAsistenciaMes()">
      ${mes}
    </button>`
  ).join('');
}

function renderizarGrillasAsistenciaMes() {
  const mes  = mesFiltroAsistencia;
  const anio = new Date().getFullYear();
  const diasEnMes  = new Date(anio, mes + 1, 0).getDate();
  const offsetInicio = obtenerDiaDeSemana(new Date(anio, mes, 1));

  document.getElementById('etiquetaMesAsistencia').textContent = NOMBRES_MESES[mes];
  renderizarGrillaAsistencia('gym',    mes, anio, diasEnMes, offsetInicio);
  renderizarGrillaAsistencia('cardio', mes, anio, diasEnMes, offsetInicio);
}

function renderizarGrillaAsistencia(tipo, mes, anio, diasEnMes, offset) {
  const claveStorage = `asist_${tipo}`;
  const datos        = obtenerDeStorage(claveStorage);
  const datosMes     = datos.find(d => d.mes === mes && d.anio === anio) || { mes, anio, dias: {} };

  // Encabezados de días de la semana
  let htmlGrilla = NOMBRES_DIAS.map(d =>
    `<div class="etiquetaDiaSemana">${d}</div>`
  ).join('');

  // Celdas vacías hasta el primer día
  for (let i = 0; i < offset; i++) {
    htmlGrilla += `<div class="celdaAsistencia inactiva"></div>`;
  }

  for (let numeroDia = 1; numeroDia <= diasEnMes; numeroDia++) {
    const fechaStr    = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(numeroDia).padStart(2, '0')}`;
    const diaSemana   = obtenerDiaDeSemana(new Date(fechaStr + 'T12:00:00'));
    const esDomingo   = diaSemana === 6;
    const esSabado    = diaSemana === 5;
    const estadoDia   = datosMes.dias[numeroDia];

    if (esDomingo) { htmlGrilla += `<div class="celdaAsistencia inactiva">—</div>`; continue; }

    let claseEstado = '';
    let contenidoCelda = esSabado ? '🟡' : String(numeroDia);
    if (estadoDia === 'fue')   { claseEstado = ' fue';   contenidoCelda = '✅'; }
    if (estadoDia === 'falto') { claseEstado = ' falto'; contenidoCelda = '❌'; }

    htmlGrilla += `<div class="celdaAsistencia${claseEstado}"
      onclick="toggleCeldaAsistencia('${tipo}',${numeroDia},'${fechaStr}')">${contenidoCelda}</div>`;
  }

  const idGrilla = tipo === 'gym' ? 'grillaAsistenciaGym' : 'grillaAsistenciaCardio';
  const idStats  = tipo === 'gym' ? 'tiraEstadisticasGym' : 'tiraEstadisticasCardio';
  document.getElementById(idGrilla).innerHTML = htmlGrilla;

  const valoresDias = Object.values(datosMes.dias);
  const countFue    = valoresDias.filter(v => v === 'fue').length;
  const countFalto  = valoresDias.filter(v => v === 'falto').length;
  const etiqueta    = tipo === 'gym' ? 'Asistencia' : 'Cardio';

  document.getElementById(idStats).innerHTML = `
    <div class="tarjetaEstadistica"><div class="valorEstadistica lima">${countFue}</div><div class="etiquetaEstadistica">${etiqueta} ✅</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica rojo">${countFalto}</div><div class="etiquetaEstadistica">Faltas ❌</div></div>
    <div class="tarjetaEstadistica"><div class="valorEstadistica azul">${diasEnMes - countFue - countFalto}</div><div class="etiquetaEstadistica">Sin marcar</div></div>`;
}

// ── ASISTENCIA: toggle de celda ───────────────────────────

function toggleCeldaAsistencia(tipo, numeroDia, fechaStr) {
  const claveStorage = `asist_${tipo}`;
  const mes          = new Date(fechaStr + 'T12:00:00').getMonth();
  const anio         = new Date(fechaStr + 'T12:00:00').getFullYear();
  const datos        = obtenerDeStorage(claveStorage);

  let datosMes = datos.find(d => d.mes === mes && d.anio === anio);
  if (!datosMes) { datosMes = { mes, anio, dias: {} }; datos.push(datosMes); }

  const estadoActual = datosMes.dias[numeroDia];
  if (!estadoActual)              datosMes.dias[numeroDia] = 'fue';
  else if (estadoActual === 'fue') datosMes.dias[numeroDia] = 'falto';
  else                             delete datosMes.dias[numeroDia];

  guardarEnStorage(claveStorage, datos);
  renderizarGrillasAsistenciaMes();
}

// ── ASISTENCIA: marcado automático ───────────────────────

function marcarAsistenciaGymAutomatica(fechaStr, asistio) {
  const fecha  = new Date(fechaStr + 'T12:00:00');
  const datos  = obtenerDeStorage('asist_gym');
  let datosMes = datos.find(d => d.mes === fecha.getMonth() && d.anio === fecha.getFullYear());
  if (!datosMes) { datosMes = { mes: fecha.getMonth(), anio: fecha.getFullYear(), dias: {} }; datos.push(datosMes); }
  datosMes.dias[fecha.getDate()] = asistio ? 'fue' : 'falto';
  guardarEnStorage('asist_gym', datos);
}

function marcarAsistenciaCardioAutomatica(fechaStr, completo) {
  const fecha  = new Date(fechaStr + 'T12:00:00');
  const datos  = obtenerDeStorage('asist_cardio');
  let datosMes = datos.find(d => d.mes === fecha.getMonth() && d.anio === fecha.getFullYear());
  if (!datosMes) { datosMes = { mes: fecha.getMonth(), anio: fecha.getFullYear(), dias: {} }; datos.push(datosMes); }
  datosMes.dias[fecha.getDate()] = completo ? 'fue' : 'falto';
  guardarEnStorage('asist_cardio', datos);
}

// ── HISTORIAL: inicialización ─────────────────────────────

function inicializarPantallaHistorial() {
  renderizarPestaniasMesHistorial();
  renderizarListaHistorial();
}

function renderizarPestaniasMesHistorial() {
  document.getElementById('pestaniasMesHistorial').innerHTML = NOMBRES_MESES.map((mes, indice) => `
    <button class="pestaniaMes${indice === mesFiltroHistorial ? ' activa' : ''}"
      onclick="mesFiltroHistorial=${indice};renderizarPestaniasMesHistorial();renderizarListaHistorial()">
      ${mes}
    </button>`
  ).join('');
}

function renderizarListaHistorial() {
  const registros = obtenerDeStorage('registros')
    .filter(r => new Date(r.fecha + 'T12:00:00').getMonth() === mesFiltroHistorial)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (!registros.length) {
    document.getElementById('listaHistorial').innerHTML =
      `<div class="mensajeVacio">Sin registros en ${NOMBRES_MESES[mesFiltroHistorial]}.</div>`;
    return;
  }

  const generarBadgeEnergia = energia => {
    const clase = energia >= 4 ? 'badgeLima' : energia >= 3 ? 'badgeNaranja' : 'badgeRojo';
    return `<span class="badgeHistorial ${clase}">⚡ ${energia}/5</span>`;
  };

  document.getElementById('listaHistorial').innerHTML = registros.map(r => {
    const fecha = new Date(r.fecha + 'T12:00:00');
    return `
      <div class="itemHistorial">
        <div class="fechaItemHistorial">${NOMBRES_DIAS[obtenerDiaDeSemana(fecha)]} ${fecha.getDate()} ${NOMBRES_MESES[fecha.getMonth()]}</div>
        <div class="grupoItemHistorial">${r.grupoMuscular}</div>
        <div class="contenedorBadgesHistorial">
          ${generarBadgeEnergia(r.energia)}
          <span class="badgeHistorial ${r.fatiga === 'Alta' ? 'badgeRojo' : r.fatiga === 'Media' ? 'badgeNaranja' : 'badgeGris'}">Fatiga: ${r.fatiga}</span>
          <span class="badgeHistorial ${r.progresion === 'Subí peso' ? 'badgeLima' : r.progresion === 'Bajé peso' ? 'badgeRojo' : 'badgeGris'}">${r.progresion}</span>
          <span class="badgeHistorial badgeAzul">😴 ${r.sueno}</span>
          ${r.molestias !== 'Ninguna' ? `<span class="badgeHistorial badgeRojo">⚠ ${r.molestias}</span>` : ''}
        </div>
        ${r.notas ? `<div class="notasItemHistorial">"${r.notas}"</div>` : ''}
      </div>`;
  }).join('');
}

// ── RUTINA: inicialización ────────────────────────────────

function inicializarPantallaRutina() {
  const contenedor = document.getElementById('contenedorRutina');
  if (contenedor.innerHTML.trim()) return; // ya fue renderizado

  contenedor.innerHTML = DATOS_RUTINA.map((diaRutina, indice) => `
    <div class="tarjetaRutinaDia">
      <div class="cabeceraRutinaDia" onclick="toggleAccordionRutina(${indice})">
        <h3 class="tituloRutinaDia">${diaRutina.dia}</h3>
        <span class="badgeGrupoMuscular ${diaRutina.claseColor}">${diaRutina.grupo}</span>
        <span class="flechaRutinaDia" id="flechaRutina-${indice}">▶</span>
      </div>
      <div class="cuerpoRutinaDia" id="cuerpoRutina-${indice}">
        <ul class="listaEjerciciosRutina">
          ${diaRutina.ejercicios.map(ej => `
            <li class="itemEjercicioRutina">
              <span>${ej.nombre}</span>
              <span class="seriesEjercicioRutina">${ej.series}</span>
            </li>`).join('')}
        </ul>
      </div>
    </div>`).join('');
}

function toggleAccordionRutina(indice) {
  const cuerpo  = document.getElementById('cuerpoRutina-' + indice);
  const flecha  = document.getElementById('flechaRutina-' + indice);
  const abierto = cuerpo.classList.toggle('abierto');
  flecha.textContent = abierto ? '▼' : '▶';
}

// ── ASISTENTE: configuración ──────────────────────────────

// El system prompt y la API key viven en el backend (Render), no acá.
// El frontend solo manda los mensajes — la key nunca llega al navegador.
// URL automática: local en desarrollo, Render en producción.
const URL_CHAT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001/api/chat'
  : 'https://registro-entrenamiento.onrender.com';

// Historial de mensajes para mantener contexto de la conversación
let historialMensajesChat = [];

// ── ASISTENTE: inicialización ─────────────────────────────

function inicializarPantallaAsistente() {
  // Solo reiniciar si está vacío
  const contenedor = document.getElementById('contenedorMensajesChat');
  if (historialMensajesChat.length === 0 && !contenedor.querySelector('.mensajeChat')) {
    // Ya tiene el mensaje de bienvenida del HTML
  }
}

// ── ASISTENTE: usar sugerencia rápida ────────────────────

function usarSugerencia(boton) {
  const pregunta = boton.textContent.trim();
  document.getElementById('inputMensajeChat').value = pregunta;
  // Ocultar sugerencias al usar una
  document.getElementById('contenedorSugerencias').style.display = 'none';
  enviarMensajeChat();
}

// ── ASISTENTE: manejar Enter ──────────────────────────────

function manejarEnterChat(evento) {
  // Enter sin Shift envía. Shift+Enter hace salto de línea.
  if (evento.key === 'Enter' && !evento.shiftKey) {
    evento.preventDefault();
    enviarMensajeChat();
  }
}

// ── ASISTENTE: enviar mensaje ─────────────────────────────

async function enviarMensajeChat() {
  const inputEl    = document.getElementById('inputMensajeChat');
  const textoPregunta = inputEl.value.trim();

  if (!textoPregunta) return;

  // Ocultar sugerencias después del primer mensaje
  document.getElementById('contenedorSugerencias').style.display = 'none';

  // Mostrar mensaje del usuario
  agregarMensajeAlChat('usuario', textoPregunta);
  inputEl.value = '';

  // Agregar al historial
  historialMensajesChat.push({ role: 'user', content: textoPregunta });

  // Deshabilitar input mientras espera
  const botonEnviar = document.getElementById('botonEnviarChat');
  botonEnviar.disabled = true;
  document.getElementById('textoBotonEnviar').textContent = '...';

  // Mostrar indicador de carga (typing dots)
  const idCarga = mostrarIndicadorCarga();

  try {
    // El frontend llama a NUESTRO backend, que tiene la API key guardada
    // como variable de entorno en Render. La key nunca toca el navegador.
    const respuesta = await fetch(URL_CHAT, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,   // token JWT del usuario logueado
      },
      body: JSON.stringify({
        mensajes: historialMensajesChat,       // solo mandamos los mensajes
      }),
    });

    const datos = await respuesta.json();

    // Remover indicador de carga
    quitarIndicadorCarga(idCarga);

    if (!respuesta.ok) {
      console.error('Error backend:', datos);
      agregarMensajeAlChat('asistente', '⚠ ' + (datos.mensaje || 'Error al conectar con el asistente.'));
      return;
    }

    const textoRespuesta = datos.respuesta;

    // Agregar respuesta al historial y mostrarla
    historialMensajesChat.push({ role: 'assistant', content: textoRespuesta });
    agregarMensajeAlChat('asistente', textoRespuesta);

  } catch (error) {
    quitarIndicadorCarga(idCarga);
    console.error('Error de red:', error);
    agregarMensajeAlChat('asistente', '⚠ No se pudo conectar. Revisá tu conexión a internet.');
  } finally {
    botonEnviar.disabled = false;
    document.getElementById('textoBotonEnviar').textContent = 'Enviar';
    inputEl.focus();
  }
}

// ── ASISTENTE: agregar mensaje al DOM ─────────────────────

function agregarMensajeAlChat(rol, texto) {
  const contenedor  = document.getElementById('contenedorMensajesChat');

  // Quitar mensaje de bienvenida si es el primer mensaje real
  const bienvenida = contenedor.querySelector('.mensajeBienvenida');
  if (bienvenida) bienvenida.remove();

  const divMensaje  = document.createElement('div');
  divMensaje.className = `mensajeChat ${rol}`;

  // Formatear texto: **negrita** y *cursiva*
  const textoFormateado = formatearTextoChat(texto);

  divMensaje.innerHTML = `
    <span class="etiquetaMensaje">${rol === 'usuario' ? 'Vos' : '🤖 GymBot'}</span>
    <div class="burbujaMensaje">${textoFormateado}</div>`;

  contenedor.appendChild(divMensaje);

  // Scroll automático al último mensaje
  contenedor.scrollTop = contenedor.scrollHeight;
}

// ── ASISTENTE: formatear markdown básico ──────────────────

function formatearTextoChat(texto) {
  return texto
    // **negrita**
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // *cursiva*
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Saltos de línea
    .replace(/\n\n/g, '</p><p style="margin-top:.6rem">')
    .replace(/\n/g, '<br/>');
}

// ── ASISTENTE: indicador de escritura ────────────────────

function mostrarIndicadorCarga() {
  const contenedor = document.getElementById('contenedorMensajesChat');
  const id         = 'carga-' + Date.now();

  const divCarga = document.createElement('div');
  divCarga.className = 'mensajeChat asistente mensajeCargando';
  divCarga.id        = id;
  divCarga.innerHTML = `
    <span class="etiquetaMensaje">🤖 GymBot</span>
    <div class="burbujaMensaje">
      <div class="puntoCarga"></div>
      <div class="puntoCarga"></div>
      <div class="puntoCarga"></div>
    </div>`;

  contenedor.appendChild(divCarga);
  contenedor.scrollTop = contenedor.scrollHeight;
  return id;
}

function quitarIndicadorCarga(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ── ASISTENTE: limpiar chat ───────────────────────────────

function limpiarChat() {
  historialMensajesChat = [];
  document.getElementById('contenedorMensajesChat').innerHTML = `
    <div class="mensajeBienvenida">
      <div class="iconoBienvenida">🏋️</div>
      <p class="textoBienvenida">Hola! Soy tu asistente de entrenamiento.<br/>Preguntame sobre técnica, diferencias entre ejercicios, grupos musculares o cualquier duda con los pesos.</p>
    </div>`;
  document.getElementById('contenedorSugerencias').style.display = 'block';
}

// ── Inicialización al cargar la página ───────────────────
inicializarPantallaHoy();
