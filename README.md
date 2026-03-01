# 🎵 Changos Garden Studios

**Sitio web oficial del estudio de producción musical y audiovisual en Toledo, España.**

> _"Tu proyecto. Tu sonido."_

---

## 📌 Índice

- [Descripción](#descripción)
- [Demo y enlaces](#demo-y-enlaces)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Instalación local](#instalación-local)
- [Variables y sistema de diseño](#variables-y-sistema-de-diseño)
- [Secciones del sitio](#secciones-del-sitio)
- [Créditos y assets](#créditos-y-assets)

---

## Descripción

Changos Garden Studios es un estudio de producción musical y audiovisual con sede en Toledo (España). Este repositorio contiene el sitio web corporativo, desarrollado como **proyecto intermodular** del Ciclo Formativo de Desarrollo de Aplicaciones Web (DAW).

El sitio incluye:
- Presentación de servicios (producción, masterización, vídeo/foto)
- Portfolio musical con reproductor de audio integrado
- Tienda de bases y merchandising
- Sistema de reservas multi-paso (modal)
- Formulario de contacto
- Mascota animada (mono bailarín) con spritesheet de 36 frames

---

## Demo y enlaces

| Recurso | URL |
|---------|-----|
| 🌐 **Página publicada** | https://ismagarcia115.github.io/|
| 🎨 **Prototipo Figma** | https://www.figma.com/design/gB84ZOrBZkCeLOTSQ2ej2r/Sin-t%C3%ADtulo?node-id=5-17&t=LcuWTt5ggzM0wsQU-1|
| 📦 **Repositorio** | https://github.com/IsmaGarcia115/ChangosGarden |


---

## Tecnologías

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **HTML5** | — | Estructura semántica |
| **Tailwind CSS** | v3 (CDN) | Sistema de estilos y utilidades |
| **Vanilla JavaScript** | ES2022 | Interactividad y módulos JS |
| **Google Fonts** | — | Tipografía Space Grotesk |
| **Git + GitHub** | — | Control de versiones |
| **GitHub Pages** | — | Publicación del sitio estático |

---

## Estructura del proyecto

```
ChangosGarden/
│
├── index.html              # Documento principal (SPA con anclas)
│
├── js/
│   └── main.js             # Lógica JavaScript modular (9 módulos)
│
├── assets/
│   ├── copas.jpg           # Fotografía  — copas de árbol
│   ├── espacio.jpg         # Fotografía  — espacio/cosmos
│   ├── estudio.jpg         # Fotografía estudio interior
│   ├── huesos.jpg          # Fotografía huesos de alien
│   ├── lianas.jpg          # Fotografía decoración
│   ├── troncos.jpg         # Fotografía exterior
│   ├── monoOriginal.png    # Arte original del mono
│   ├── monoSprites.png     # Spritesheet base del mono
│   ├── sprite-256px-36.png # Spritesheet animación (6×6 frames, 256px c/u)
│   └── svg/
│       └── sprite.svg      # Biblioteca SVG (iconos + background)
│
├── sound/
│   ├── Dr4m4turg0-BreakbeatAndalu.mp3
│   ├── Dr4m4turg0-C4NN4BI$.mp3
│   ├── Dr4m4turg0-M4TRIX.mp3
│   ├── DR4M4TURG0-ZOLTRAAK.mp3
│   ├── KAILAS -LA_VIE_N_NOIR .mp3
│   ├── Krono-Calabobo.mp3
│   ├── Krono-Hakai.mp3
│   ├── SESEW-ALGO-ESTÁ-CAMBIANDO.mp3
│   └── SESEW-LA VOZ DE MI CEREBRO FT. FURIUS.mp3
│
└── README.md               # Este archivo
```

---

## Requisitos

### Para ver el proyecto
- Navegador moderno con soporte ES2022 (Chrome 94+, Firefox 93+, Safari 15+)
- Conexión a internet (carga CDN de Tailwind y Google Fonts)

### Para desarrollar localmente
- **Node.js** v18+ (opcional, solo si se quiere compilar Tailwind en modo producción)
- **Git** instalado
- Editor recomendado: **VS Code** con extensiones:
  - Tailwind CSS IntelliSense
  - Prettier - Code Formatter
  - Live Server

### Dependencias externas (CDN, sin instalación)
```html
<!-- Tailwind CSS v3 -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Space Grotesk (Google Fonts) -->
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

> **Nota de producción:** Para un entorno de producción real se recomienda compilar Tailwind con `npx tailwindcss -i input.css -o output.css --minify` y eliminar la dependencia del CDN.

---

## Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/[usuario]/ChangosGarden.git

# 2. Entrar en la carpeta
cd ChangosGarden

# 3. Abrir en el navegador
# Opción A: con Live Server (VS Code)
# → Click derecho en index.html → "Open with Live Server"

# Opción B: servidor Python simple
python -m http.server 8080
# → Visitar http://localhost:8080
```

No se requiere ninguna instalación de paquetes npm para el funcionamiento básico.

---

## Variables y sistema de diseño

### Paleta de colores (Tailwind config)

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        cg: {
          'green':        '#22c55e',  // Primario — CTAs, acentos
          'green-dark':   '#16a34a',  // Hover verde
          'green-light':  '#86efac',  // Sutil / badges
          'green-bg':     '#f0fdf4',  // Fondos claros verdes
          'purple':       '#a855f7',  // Secundario — gradientes
          'purple-dark':  '#7e22ce',  // Hover morado
          'purple-light': '#d8b4fe',  // Sutil / decorativos
          'purple-bg':    '#faf5ff',  // Fondos claros morados
        }
      }
    }
  }
}
```

### Tipografía

| Variable | Valor |
|----------|-------|
| `font-sans` | `Space Grotesk, system-ui, sans-serif` |
| Pesos disponibles | 300 / 400 / 500 / 600 / 700 / 800 |

### Clases personalizadas (@apply equivalentes)

| Clase | Descripción |
|-------|-------------|
| `.btn-brand` | Botón primario con gradiente verde→morado |
| `.btn-outline` | Botón borde verde, fill en hover |
| `.btn-outline-purple` | Botón borde morado, fill en hover |
| `.gradient-brand` | Fondo gradiente 135° verde→morado |
| `.gradient-text` | Texto con clip de gradiente |
| `.service-card` | Tarjeta con borde top de color y elevación hover |
| `.portfolio-card` | Tarjeta portfolio con sombra en hover |
| `.audio-bar` | Barra de ecualización animada |
| `.reveal` | Fade-in + slide-up al scroll |
| `.reveal-left` | Fade-in + slide desde izquierda |
| `.reveal-right` | Fade-in + slide desde derecha |

---

## Secciones del sitio

| ID | Sección | Descripción |
|----|---------|-------------|
| `#hero` | Hero | Título, subtítulo, CTAs, mono bailarín, barra audio |
| `#marquee` | Marquee | Banda rodante con géneros y servicios |
| `#about` | Nosotros | Historia, valores, estadísticas del estudio |
| `#services` | Servicios | Producción Musical · Masterización · Audiovisual |
| `#portfolio` | Portfolio | Grid de pistas con reproductor y filtros |
| `#shop` | Tienda | Bases y Merch con carrito |
| `#booking` | Reservas | Modal multi-paso (5 pasos) |
| `#contact` | Contacto | Formulario y footer |

### Módulos JavaScript (js/main.js)

1. **SVGManager** — Carga y gestión de sprite.svg
2. **Navigation** — Navbar sticky + menú hamburguesa
3. **Booking Modal** — Flujo de reserva multi-paso
4. **Portfolio Filter** — Filtrado por categoría
5. **Shop Tabs** — Toggle bases/merch + carrito
6. **Audio Player** — Reproductor de pistas MP3
7. **Contact Form** — Validación del formulario
8. **Scroll Reveal** — IntersectionObserver para animaciones
9. **Init** — Bootstrap de todos los módulos

---

## Créditos y assets

### Música
Todas las pistas de audio son producciones originales de los artistas:
- **Dr4m4turg0** — BreakbeatAndalu, C4NN4BI$, M4TRIX, ZOLTRAAK
- **Krono** — Calabobo, Hakai
- **SESEW** — Algo Está Cambiando, La Voz de Mi Cerebro (ft. Furius)
- **KAILAS** — La Vie en Noir

### Imágenes
Fotografías de producción propia del estudio Changos Garden Studios.

### Tipografía
[Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — Florian Karsten (Google Fonts, SIL Open Font License).

---

## Proyecto académico

| Campo | Valor |
|-------|-------|
| **Ciclo formativo** | Desarrollo de Aplicaciones Web (DAW) — 2.º curso |
| **Módulo** | Diseño de Interfaces Web (DIW) |
| **Centro** | IES Azarquiel |
| **Curso** | 2025 – 2026 |

---

_Changos Garden Studios © 2026 — Proyecto Intermodular DAW_
