# 🏋️ GymTracker — Registro de Entrenamiento 2026

Aplicación web personal para registrar el entrenamiento diario: asistencia, cardio, ejercicios con cargas, y sensaciones físicas. Desarrollada con **HTML, CSS y JavaScript vanilla** — sin frameworks ni dependencias externas.

Inspirada en mis propias planillas de Excel que usaba para trackear todo, transformadas en una sola app que puedo abrir desde cualquier dispositivo.

## Demo

> Abrí `index.html` directo en el navegador. No necesita servidor ni conexión a internet.

---

## Funcionalidades

| Módulo | Qué registra |
|---|---|
| **Hoy** | Grupo muscular, energía (1–5), fatiga, sensación post-entreno, progresión, calidad de sueño, molestias y notas libres |
| **Cardio** | Min caminando / corriendo / bici · pulsaciones · total automático |
| **Ejercicios** | Nombre, descripción del peso, kg totales, series y semana — con progresión visual por mes |
| **Asistencia** | Grilla mensual ✅/❌ por día para gym y cardio por separado |
| **Historial** | Todos los registros filtrados por mes con badges de estado |
| **Rutina** | Rutina semanal completa con ejercicios y series, consultable offline |

---

## Técnicas de JavaScript aplicadas

```
✔ Manipulación del DOM — querySelector, innerHTML, createElement, classList
✔ localStorage — persistencia entre sesiones (get/set/parse)
✔ Eventos — onclick, oninput, onchange
✔ Array methods — filter, map, find, forEach, sort, reduce
✔ Date API — cálculo de día de la semana, semana del mes, filtros por mes
✔ Lógica de estado — objeto de estado sincronizado con la UI
✔ Render dinámico — funciones de renderizado reactivo sin frameworks
✔ Diseño de datos — estructura JSON para colecciones múltiples
```

## Diseño y CSS

```
✔ CSS Variables — sistema de tokens (colores, radios, tipografía)
✔ CSS Grid y Flexbox — layouts responsivos
✔ Media queries — adaptación mobile
✔ Animaciones CSS — toast, transiciones de hover, barras de progreso
✔ Google Fonts — Bebas Neue + DM Sans + DM Mono
✔ Custom scrollbar — scrollbar estilizado nativo
```

---

## Estructura del proyecto

```
gymtracker/
├── index.html     # App completa (HTML + CSS + JS en un archivo)
└── README.md
```

Todo en un único archivo — decisión intencional para demostrar que se puede construir una app funcional y bien estructurada sin herramientas de build.

---

## Cómo usar

```bash
# Abrí directo en el navegador
open index.html

# O con Live Server (VSCode)
# Click derecho en index.html → "Open with Live Server"
```

Al abrirlo por primera vez, la app está vacía. Empezá desde la pestaña **"Hoy"** para registrar tu primer entrenamiento.

---

## Persistencia de datos

Todos los datos se guardan en `localStorage` del navegador, organizados en estas colecciones:

| Key | Contenido |
|---|---|
| `registros` | Registros diarios (energía, fatiga, sensaciones, etc.) |
| `cardios` | Sesiones de cardio con minutos por modalidad |
| `ejercicios` | Cargas por ejercicio, semana y mes |
| `asist_gym` | Asistencia al gym por mes (✅/❌ por día) |
| `asist_cardio` | Cardio completado por mes (✅/❌ por día) |

---

## Decisiones de diseño

- **Una sola pestaña = un solo flujo**: cada módulo tiene su propia pantalla para no mezclar datos.
- **Guardar desde "Hoy" marca asistencia automáticamente**: si guardás un registro, el día se marca ✅ en la grilla de asistencia.
- **Guardar cardio también actualiza asistencia**: consistencia entre módulos sin doble entrada.
- **Progresión visual**: cada ejercicio muestra barras de progreso relativas al peso máximo del mes para visualizar la evolución.

---

## Origen del proyecto

Reemplacé 5 archivos de Excel (Asistencia, Cardio, Proceso Piernas, Proceso Superior, Registro Simple) con esta app unificada. La lógica de cada planilla está representada en la estructura de datos y los módulos de la app.

---

> Desarrollado por **Nicole Llumpo** — Futura Ingeniera en Sistemas de Información 
> Buenos Aires, 2026