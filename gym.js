/*─────────────────────────────────────────────────── CONSTANTES Y DATOS───────────────────────────────────────────────── */

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS  = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];

const RUTINA_DATA = [
{
    dia: 'LUNES', grupo: 'ISQUIOS · GLÚTEOS', color: 'rd-lunes',
    ejercicios: [
      {nombre:'Serie movilidad',series:'5-10 min'},
      {nombre:'Hip Thrust libre',series:'4×10'},
      {nombre:'Peso muerto convencional',series:'4×10'},
      {nombre:'Sentadilla búlgara',series:'4×10'},
      {nombre:'Patada de glúteos',series:'4×10'},
      {nombre:'Máquina abductores (cerrado-glúteos)',series:'4×10'},
      {nombre:'Máquina de isquios',series:'4×10'},
      {nombre:'Cinta',series:'5-10 min'},
    ]
  },
  {
    dia: 'MARTES', grupo: 'ESPALDA · BÍCEPS · ABDOMEN', color: 'rd-martes',
    ejercicios: [
      {nombre:'Dorsalera pecho agarre abierto',series:'4×10'},
      {nombre:'Remo bajo con cable',series:'4×10'},
      {nombre:'Pullover',series:'4×10'},
      {nombre:'Remo con mancuerna',series:'4×10'},
      {nombre:'Curl martillo',series:'4×10'},
      {nombre:'Serie abdominales',series:'—'},
      {nombre:'Cinta',series:'5-10 min'},
    ]
  },
  {
    dia: 'MIÉRCOLES', grupo: 'CUADRICEPS · GLÚTEOS', color: 'rd-miercoles',
    ejercicios: [
      {nombre:'Serie movilidad',series:'5-10 min'},
      {nombre:'Sentadilla en Smith',series:'4×10'},
      {nombre:'Sentadilla goblet mancuerna',series:'4×10'},
      {nombre:'Sillón de cuadriceps + mantengo + cortas',series:'4×10'},
      {nombre:'Prensa (medio-bajo-cerrado)',series:'4×10'},
      {nombre:'Aductores en máquina (abierto)',series:'4×15'},
      {nombre:'Cinta',series:'5-10 min'},
    ]
  },
  {
    dia: 'JUEVES', grupo: 'PECHO · TRÍCEPS · HOMBRO', color: 'rd-jueves',
    ejercicios: [
      {nombre:'Aperturas Peck Deck',series:'3×10'},
      {nombre:'Press de banca con barra',series:'4×10'},
      {nombre:'Banco inclinado',series:'4×10'},
      {nombre:'Press de hombros con mancuerna',series:'4×10'},
      {nombre:'Vuelos laterales',series:'4×10'},
      {nombre:'Tríceps pushdown en polea',series:'4×10'},
      {nombre:'Serie abdominales',series:'—'},
      {nombre:'Cinta',series:'5-10 min'},
    ]
  },
  {
    dia: 'VIERNES', grupo: 'LEGS DAY', color: 'rd-viernes',
    ejercicios: [
      {nombre:'Serie movilidad',series:'5-10 min'},
      {nombre:'Hip Thrust en máquina',series:'10 completas + 10 mantengo + 10 cortas'},
      {nombre:'Peso muerto + unilateral con mancuerna',series:'4×10'},
      {nombre:'Sentadilla sumo',series:'4×12'},
      {nombre:'Abductores',series:'—'},
      {nombre:'Cinta',series:'5-10 min'},
    ]
  },
];

/*─────────────────────────────────────────────────── ESTADO ─────────────────────────────────────────────────── */

let state = {
  energia: 0,
  fatiga: '',
  sensacion: '',
  progresion: '',
  sueno: '',
  molestias: '',
};

let mesFiltroHist = new Date().getMonth();
let mesFiltroEj   = new Date().getMonth();
let mesFiltroAsist = new Date().getMonth();

/* ───────────────────────────────────────────────LOCALSTORAGE─────────────────────────────────────────────────── */

function ls_get(key)      { try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] } }
function ls_set(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

/* ────────────────────────────────────────────────────────
   NAVEGACIÓN
─────────────────────────────────────────────────────────── */

function setScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  document.querySelector(`.nav-tab[onclick="setScreen('${id}')"]`).classList.add('active');

  if (id === 'hoy')        initHoy();
  if (id === 'cardio')     initCardio();
  if (id === 'ejercicios') initEjercicios();
  if (id === 'asistencia') initAsistencia();
  if (id === 'historial')  initHistorial();
  if (id === 'rutina')     initRutina();
}

/* ────────────────────────────────────────────────────────
   TOAST
─────────────────────────────────────────────────────────── */

function toast(msg, err = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'show' + (err ? ' err' : '');
  setTimeout(() => t.className = '', 2500);
}

/* ────────────────────────────────────────────────────────
   HOY — REGISTRO SIMPLE
─────────────────────────────────────────────────────────── */

function initHoy() {
  const fecha = document.getElementById('hoy-fecha');
  if (!fecha.value) fecha.value = today();
  actualizarFechaHoy();
  renderStatsHoy();
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function actualizarFechaHoy() {
  const f = document.getElementById('hoy-fecha').value || today();
  const d = new Date(f + 'T12:00:00');
  document.getElementById('hoy-titulo').textContent = DIAS[diaSemana(d)];
  document.getElementById('hoy-fecha-label').textContent =
    d.getDate() + ' de ' + MESES[d.getMonth()] + ' ' + d.getFullYear();
  document.getElementById('mes-actual-label').textContent = MESES[d.getMonth()];
  renderStatsHoy();
}

function diaSemana(d) {
  // Lun=0 .. Dom=6
  return (d.getDay() + 6) % 7;
}

function setStar(n) {
  state.energia = n;
  document.querySelectorAll('#stars-energia .star').forEach((s, i) => {
    s.classList.toggle('on', i < n);
  });
}

function togglePill(el, campo, val) {
  const group = el.closest('.pill-group');
  group.querySelectorAll('.pill').forEach(p => p.classList.remove('on'));
  el.classList.add('on');
  state[campo] = val;
}

function guardarRegistro() {
  const fecha  = document.getElementById('hoy-fecha').value || today();
  const grupo  = document.getElementById('reg-grupo').value;
  const notas  = document.getElementById('reg-notas').value.trim();

  if (!grupo)            return toast('Seleccioná el grupo muscular', true);
  if (!state.energia)    return toast('Seleccioná la energía', true);
  if (!state.fatiga)     return toast('Seleccioná la fatiga', true);
  if (!state.sensacion)  return toast('Seleccioná la sensación', true);
  if (!state.progresion) return toast('Seleccioná la progresión', true);
  if (!state.sueno)      return toast('Seleccioná el sueño', true);
  if (!state.molestias)  return toast('Seleccioná molestias', true);

  const registros = ls_get('registros');

  // Reemplazar si ya existe para esa fecha
  const idx = registros.findIndex(r => r.fecha === fecha);
  const entry = { fecha, grupo, ...state, notas };
  if (idx > -1) registros[idx] = entry;
  else registros.push(entry);

  ls_set('registros', registros);
  toast('✓ Registro guardado');
  limpiarFormHoy();
  renderStatsHoy();

  // También marcar asistencia automáticamente
  marcarAsistAutoGym(fecha, true);
}

function limpiarFormHoy() {
  document.getElementById('reg-grupo').value = '';
  document.getElementById('reg-notas').value = '';
  state = { energia:0, fatiga:'', sensacion:'', progresion:'', sueno:'', molestias:'' };
  document.querySelectorAll('.star').forEach(s => s.classList.remove('on'));
  document.querySelectorAll('.pill').forEach(s => s.classList.remove('on'));
}

function renderStatsHoy() {
  const f = document.getElementById('hoy-fecha')?.value || today();
  const mes = new Date(f + 'T12:00:00').getMonth();
  const registros = ls_get('registros').filter(r => new Date(r.fecha + 'T12:00:00').getMonth() === mes);

  const total  = registros.length;
  const prom   = total ? (registros.reduce((a,r) => a + r.energia, 0) / total).toFixed(1) : '—';
  const fatiga = registros.filter(r => r.fatiga === 'Alta').length;
  const prog   = registros.filter(r => r.progresion === 'Subí peso').length;

  document.getElementById('stats-hoy').innerHTML = `
    <div class="stat"><div class="stat-val lime">${total}</div><div class="stat-label">Entrenos</div></div>
    <div class="stat"><div class="stat-val blue">${prom}</div><div class="stat-label">Energía ⌀</div></div>
    <div class="stat"><div class="stat-val red">${fatiga}</div><div class="stat-label">Fatiga Alta</div></div>
    <div class="stat"><div class="stat-val orange">${prog}</div><div class="stat-label">Subí peso</div></div>
  `;
}

/* ────────────────────────────────────────────────────────
   CARDIO
─────────────────────────────────────────────────────────── */

function initCardio() {
  const fecha = document.getElementById('cardio-fecha');
  if (!fecha.value) fecha.value = today();
  actualizarFechaCardio();

  // Auto-calcular totales
  ['c-caminando','c-corriendo','c-bici'].forEach(id => {
    document.getElementById(id).oninput = calcTotalesCardio;
  });
}

function actualizarFechaCardio() {
  const f = document.getElementById('cardio-fecha').value || today();
  const d = new Date(f + 'T12:00:00');
  document.getElementById('cardio-titulo').textContent = DIAS[diaSemana(d)].toUpperCase();
  document.getElementById('cardio-fecha-label').textContent =
    d.getDate() + ' de ' + MESES[d.getMonth()] + ' ' + d.getFullYear();
  renderSemanaCardio(f);
  renderStatsCardioMes(d.getMonth());
}

function calcTotalesCardio() {
  const c = parseFloat(document.getElementById('c-caminando').value) || 0;
  const r = parseFloat(document.getElementById('c-corriendo').value) || 0;
  const b = parseFloat(document.getElementById('c-bici').value) || 0;
  document.getElementById('c-totales').value = c + r + b;
}

function guardarCardio() {
  const fecha = document.getElementById('cardio-fecha').value || today();
  const cam   = parseFloat(document.getElementById('c-caminando').value) || 0;
  const cor   = parseFloat(document.getElementById('c-corriendo').value) || 0;
  const bici  = parseFloat(document.getElementById('c-bici').value) || 0;
  const hzCam = parseFloat(document.getElementById('c-hz-cam').value) || 0;
  const hzCor = parseFloat(document.getElementById('c-hz-cor').value) || 0;
  const total = cam + cor + bici;

  const cardios = ls_get('cardios');
  const idx = cardios.findIndex(c => c.fecha === fecha);
  const entry = { fecha, cam, cor, bici, hzCam, hzCor, total };
  if (idx > -1) cardios[idx] = entry;
  else cardios.push(entry);

  ls_set('cardios', cardios);
  toast('✓ Cardio guardado');
  limpiarCardio();

  // marcar asistencia cardio
  marcarAsistAutoCardio(fecha, total > 0);
  actualizarFechaCardio();
}

function limpiarCardio() {
  ['c-caminando','c-corriendo','c-bici','c-hz-cam','c-hz-cor','c-totales'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

function renderSemanaCardio(fechaStr) {
  const d = new Date(fechaStr + 'T12:00:00');
  // Obtener lunes de esa semana
  const dow = diaSemana(d);
  const lunes = new Date(d);
  lunes.setDate(d.getDate() - dow);

  const cardios = ls_get('cardios');
  let html = '';
  for (let i = 0; i < 7; i++) {
    const dia = new Date(lunes);
    dia.setDate(lunes.getDate() + i);
    const key = dia.toISOString().slice(0,10);
    const reg = cardios.find(c => c.fecha === key);
    const total = reg ? reg.total : 0;
    const isHoy = key === fechaStr;
    html += `<div class="cardio-day${isHoy?' selected':''}">
      <div class="cday-name">${DIAS[i]}</div>
      <div class="cday-total">${total > 0 ? total : '—'}</div>
      ${total > 0 ? `<div style="font-family:var(--mono);font-size:.6rem;color:var(--muted);text-align:center">min</div>` : ''}
    </div>`;
  }
  document.getElementById('cardio-semana').innerHTML = html;
}

function renderStatsCardioMes(mes) {
  const cardios = ls_get('cardios').filter(c => new Date(c.fecha+'T12:00:00').getMonth() === mes);
  const totalMin = cardios.reduce((a,c) => a + c.total, 0);
  const totalCam = cardios.reduce((a,c) => a + c.cam, 0);
  const totalCor = cardios.reduce((a,c) => a + c.cor, 0);
  const totalBici = cardios.reduce((a,c) => a + c.bici, 0);
  document.getElementById('stats-cardio-mes').innerHTML = `
    <div class="stat"><div class="stat-val blue">${totalMin}</div><div class="stat-label">Min totales</div></div>
    <div class="stat"><div class="stat-val lime">${totalCam}</div><div class="stat-label">Min caminando</div></div>
    <div class="stat"><div class="stat-val orange">${totalCor}</div><div class="stat-label">Min corriendo</div></div>
    <div class="stat"><div class="stat-val">${totalBici}</div><div class="stat-label">Min bicicleta</div></div>
  `;
}

/* ────────────────────────────────────────────────────────
   EJERCICIOS
─────────────────────────────────────────────────────────── */

function initEjercicios() {
  const fecha = document.getElementById('ej-fecha');
  if (!fecha.value) fecha.value = today();
  actualizarFechaEj();
  renderMesTabsEj();
  renderProgresionEj();
}

function actualizarFechaEj() {
  const f = document.getElementById('ej-fecha').value || today();
  const d = new Date(f + 'T12:00:00');
  document.getElementById('ej-titulo').textContent = 'SEM ' + getSemanaDelMes(d);
  document.getElementById('ej-fecha-label').textContent =
    DIAS[diaSemana(d)] + ' ' + d.getDate() + ' ' + MESES[d.getMonth()];
  // Autocompletar semana
  document.getElementById('ej-semana').value = getSemanaDelMes(d);
}

function getSemanaDelMes(d) {
  const primero = new Date(d.getFullYear(), d.getMonth(), 1);
  const offset = diaSemana(primero);
  return Math.ceil((d.getDate() + offset) / 7);
}

function guardarEjercicio() {
  const fecha  = document.getElementById('ej-fecha').value || today();
  const nombre = document.getElementById('ej-nombre').value;
  const desc   = document.getElementById('ej-peso-desc').value.trim();
  const pesoT  = parseFloat(document.getElementById('ej-peso-total').value) || 0;
  const series = document.getElementById('ej-series').value.trim();
  const semana = parseInt(document.getElementById('ej-semana').value) || 1;

  if (!nombre) return toast('Seleccioná el ejercicio', true);
  if (!desc)   return toast('Describí el peso usado', true);

  const ejercicios = ls_get('ejercicios');
  ejercicios.push({ fecha, nombre, desc, pesoTotal: pesoT, series, semana });
  ls_set('ejercicios', ejercicios);
  toast('✓ Ejercicio guardado');
  limpiarEj();
  renderProgresionEj();
}

function limpiarEj() {
  document.getElementById('ej-nombre').value = '';
  document.getElementById('ej-peso-desc').value = '';
  document.getElementById('ej-peso-total').value = '';
  document.getElementById('ej-series').value = '';
}

function renderMesTabsEj() {
  let html = '';
  MESES.forEach((m, i) => {
    html += `<button class="mes-tab${i===mesFiltroEj?' active':''}" onclick="mesFiltroEj=${i};renderMesTabsEj();renderProgresionEj()">${m}</button>`;
  });
  document.getElementById('ej-mes-tabs').innerHTML = html;
}

function renderProgresionEj() {
  const ejercicios = ls_get('ejercicios').filter(e =>
    new Date(e.fecha+'T12:00:00').getMonth() === mesFiltroEj
  );

  if (!ejercicios.length) {
    document.getElementById('ej-progresion').innerHTML = '<div class="empty">Sin ejercicios en este mes.</div>';
    return;
  }

  // Agrupar por nombre
  const grupos = {};
  ejercicios.forEach(e => {
    if (!grupos[e.nombre]) grupos[e.nombre] = [];
    grupos[e.nombre].push(e);
  });

  let html = '';
  Object.entries(grupos).forEach(([nombre, regs]) => {
    regs.sort((a,b) => a.semana - b.semana);
    const maxPeso = Math.max(...regs.map(r => r.pesoTotal));
    const minPeso = Math.min(...regs.map(r => r.pesoTotal));
    const trend = regs.length > 1
      ? (regs[regs.length-1].pesoTotal > regs[0].pesoTotal ? '📈' :
         regs[regs.length-1].pesoTotal < regs[0].pesoTotal ? '📉' : '➡')
      : '—';

    html += `<div class="ej-section">
      <div class="ej-name">${trend} ${nombre}</div>`;

    regs.forEach(r => {
      const pct = maxPeso > 0 ? (r.pesoTotal / maxPeso * 100) : 0;
      html += `<div class="prog-wrap">
        <div class="prog-header">
          <span class="prog-label">Sem ${r.semana} — ${r.desc}</span>
          <span class="prog-val">${r.pesoTotal} kg · ${r.series}</span>
        </div>
        <div class="prog-track">
          <div class="prog-fill orange" style="width:${pct}%"></div>
        </div>
      </div>`;
    });

    html += `<div style="font-family:var(--mono);font-size:.7rem;color:var(--muted);margin-top:.5rem;margin-bottom:1.25rem">
      Máx: <span style="color:var(--acc)">${maxPeso} kg</span> · 
      Mín: <span style="color:var(--muted)">${minPeso} kg</span>
    </div></div>`;
  });

  document.getElementById('ej-progresion').innerHTML = html;
}

/* ────────────────────────────────────────────────────────
   ASISTENCIA
─────────────────────────────────────────────────────────── */

function initAsistencia() {
  renderMesTabsAsist();
  renderAsistMes();
}

function renderMesTabsAsist() {
  let html = '';
  MESES.forEach((m, i) => {
    html += `<button class="mes-tab${i===mesFiltroAsist?' active':''}" onclick="mesFiltroAsist=${i};renderMesTabsAsist();renderAsistMes()">${m}</button>`;
  });
  document.getElementById('asist-mes-tabs').innerHTML = html;
}

function renderAsistMes() {
  const mes = mesFiltroAsist;
  const anio = new Date().getFullYear();
  const diasEnMes = new Date(anio, mes+1, 0).getDate();
  const primerDia = new Date(anio, mes, 1);
  const offsetInicio = diaSemana(primerDia);

  document.getElementById('asist-mes-label').textContent = MESES[mes];
  renderGridAsist('gym', mes, anio, diasEnMes, offsetInicio);
  renderGridAsist('cardio', mes, anio, diasEnMes, offsetInicio);
}

function renderGridAsist(tipo, mes, anio, diasEnMes, offset) {
  const key = `asist_${tipo}`;
  const data = ls_get(key);
  const mesData = data.find(d => d.mes === mes && d.anio === anio) || { mes, anio, dias: {} };

  // Headers
  let html = DIAS.map(d => `<div class="asist-day-label">${d}</div>`).join('');

  // Celdas vacías de offset
  for (let i = 0; i < offset; i++) {
    html += `<div class="asist-cell na"></div>`;
  }

  for (let d = 1; d <= diasEnMes; d++) {
    const fecha = `${anio}-${String(mes+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dow = diaSemana(new Date(fecha + 'T12:00:00'));
    const esSabado = dow === 5;
    const esDomingo = dow === 6;
    const val = mesData.dias[d];

    // Domingos siempre NA
    if (esDomingo) { html += `<div class="asist-cell na">—</div>`; continue; }

    let cls = '';
    let emoji = esSabado ? '🟡' : String(d);
    if (val === 'fue')  { cls = ' fue'; emoji = '✅' }
    if (val === 'falto'){ cls = ' falto'; emoji = '❌' }

    html += `<div class="asist-cell${cls}" onclick="toggleAsist('${tipo}',${d},'${fecha}')">${emoji}</div>`;
  }

  const gridId  = tipo === 'gym' ? 'asist-grid-gym' : 'asist-grid-cardio';
  const statsId = tipo === 'gym' ? 'asist-stats-gym' : 'asist-stats-cardio';
  document.getElementById(gridId).innerHTML = html;

  // Stats
  const dias = Object.values(mesData.dias);
  const fue   = dias.filter(v => v === 'fue').length;
  const falto = dias.filter(v => v === 'falto').length;
  const label = tipo === 'gym' ? 'Asistencia' : 'Cardio';
  document.getElementById(statsId).innerHTML = `
    <div class="stat"><div class="stat-val lime">${fue}</div><div class="stat-label">${label} ✅</div></div>
    <div class="stat"><div class="stat-val red">${falto}</div><div class="stat-label">Faltas ❌</div></div>
    <div class="stat"><div class="stat-val blue">${diasEnMes - fue - falto}</div><div class="stat-label">Sin marcar</div></div>
  `;
}

function toggleAsist(tipo, dia, fecha) {
  const key = `asist_${tipo}`;
  const mes  = new Date(fecha+'T12:00:00').getMonth();
  const anio = new Date(fecha+'T12:00:00').getFullYear();
  const data = ls_get(key);

  let mesData = data.find(d => d.mes === mes && d.anio === anio);
  if (!mesData) { mesData = { mes, anio, dias: {} }; data.push(mesData); }

  const cur = mesData.dias[dia];
  if (!cur)         mesData.dias[dia] = 'fue';
  else if (cur === 'fue')   mesData.dias[dia] = 'falto';
  else              delete mesData.dias[dia];

  ls_set(key, data);
  renderAsistMes();
}

function marcarAsistAutoGym(fecha, fue) {
  const d    = new Date(fecha+'T12:00:00');
  const mes  = d.getMonth();
  const anio = d.getFullYear();
  const dia  = d.getDate();
  const key  = 'asist_gym';
  const data = ls_get(key);
  let mesData = data.find(x => x.mes === mes && x.anio === anio);
  if (!mesData) { mesData = { mes, anio, dias: {} }; data.push(mesData); }
  mesData.dias[dia] = fue ? 'fue' : 'falto';
  ls_set(key, data);
}

function marcarAsistAutoCardio(fecha, cumple) {
  const d    = new Date(fecha+'T12:00:00');
  const mes  = d.getMonth();
  const anio = d.getFullYear();
  const dia  = d.getDate();
  const key  = 'asist_cardio';
  const data = ls_get(key);
  let mesData = data.find(x => x.mes === mes && x.anio === anio);
  if (!mesData) { mesData = { mes, anio, dias: {} }; data.push(mesData); }
  mesData.dias[dia] = cumple ? 'fue' : 'falto';
  ls_set(key, data);
}

/* ────────────────────────────────────────────────────────
   HISTORIAL
─────────────────────────────────────────────────────────── */

function initHistorial() {
  renderMesTabsHist();
  renderHistorial();
}

function renderMesTabsHist() {
  let html = '';
  MESES.forEach((m, i) => {
    html += `<button class="mes-tab${i===mesFiltroHist?' active':''}" onclick="mesFiltroHist=${i};renderMesTabsHist();renderHistorial()">${m}</button>`;
  });
  document.getElementById('hist-mes-tabs').innerHTML = html;
}

function renderHistorial() {
  const registros = ls_get('registros')
    .filter(r => new Date(r.fecha+'T12:00:00').getMonth() === mesFiltroHist)
    .sort((a,b) => b.fecha.localeCompare(a.fecha));

  if (!registros.length) {
    document.getElementById('historial-list').innerHTML = '<div class="empty">Sin registros en ' + MESES[mesFiltroHist] + '.</div>';
    return;
  }

  const energiaBadge = e => {
    const c = e >= 4 ? 'hb-lime' : e >= 3 ? 'hb-orange' : 'hb-red';
    return `<span class="hbadge ${c}">⚡ ${e}/5</span>`;
  };

  let html = '';
  registros.forEach(r => {
    const d = new Date(r.fecha+'T12:00:00');
    html += `<div class="hist-item">
      <div>
        <div class="hist-date">${DIAS[diaSemana(d)]} ${d.getDate()} ${MESES[d.getMonth()]}</div>
        <div class="hist-main">${r.grupo}</div>
        <div class="hist-badges">
          ${energiaBadge(r.energia)}
          <span class="hbadge ${r.fatiga==='Alta'?'hb-red':r.fatiga==='Media'?'hb-orange':'hb-gray'}">Fatiga: ${r.fatiga}</span>
          <span class="hbadge ${r.progresion==='Subí peso'?'hb-lime':r.progresion==='Bajé peso'?'hb-red':'hb-gray'}">${r.progresion}</span>
          <span class="hbadge hb-blue">😴 ${r.sueno}</span>
          ${r.molestias !== 'Ninguna' ? `<span class="hbadge hb-red">⚠ ${r.molestias}</span>` : ''}
        </div>
        ${r.notas ? `<div class="hist-sub">"${r.notas}"</div>` : ''}
      </div>
    </div>`;
  });

  document.getElementById('historial-list').innerHTML = html;
}

/* ────────────────────────────────────────────────────────
   RUTINA
─────────────────────────────────────────────────────────── */

function initRutina() {
  const c = document.getElementById('rutina-container');
  if (c.innerHTML.trim()) return; // ya renderizado

  c.innerHTML = RUTINA_DATA.map((dia, i) => `
    <div class="rutina-day">
      <div class="rutina-day-head" onclick="toggleRutinaDia(${i})">
        <h3>${dia.dia}</h3>
        <span class="rutina-day-badge ${dia.color}">${dia.grupo}</span>
        <span style="margin-left:auto;color:var(--muted);font-size:1rem" id="rdArrow-${i}">▶</span>
      </div>
      <div class="rutina-day-body" id="rdBody-${i}">
        <ul class="ej-list">
          ${dia.ejercicios.map(e => `
            <li>
              <span>${e.nombre}</span>
              <span class="ej-series">${e.series}</span>
            </li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
}

function toggleRutinaDia(i) {
  const body  = document.getElementById('rdBody-'+i);
  const arrow = document.getElementById('rdArrow-'+i);
  const open  = body.classList.toggle('open');
  arrow.textContent = open ? '▼' : '▶';
}

/* ────────────────────────────────────────────────────────
   INIT
─────────────────────────────────────────────────────────── */
initHoy();