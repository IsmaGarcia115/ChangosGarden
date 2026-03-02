/**
 * CHANGOS GARDEN STUDIOS — main.js
 * Módulos: SVGManager · Navegación · Booking · Portfolio · Reproductor · Crew · Contacto · ScrollReveal · MonoDancer
 */
'use strict';

/* ═══ 1. SVG MANAGER ═══ */
const SVGManager = {
  spritePath: 'assets/svg/sprite.svg',
  async init() {
    try {
      const res = await fetch(this.spritePath);
      if (!res.ok) throw new Error();
      const container = document.getElementById('svg-sprite-container');
      if (container) container.innerHTML = await res.text();
      document.querySelectorAll('[data-svg-icon]').forEach(el => {
        const id = el.dataset.svgIcon;
        if (!id) return;
        const symbol = document.getElementById(id);
        const viewBox = symbol?.getAttribute('viewBox');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('aria-hidden', 'true');
        if (viewBox) svg.setAttribute('viewBox', viewBox);
        const size = el.dataset.svgSize;
        svg.style.cssText = (size ? `width:${size}px;height:${size}px;` : 'width:1em;height:1em;') + 'vertical-align:middle;display:inline-block;';
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', `#${id}`);
        svg.appendChild(use);
        el.innerHTML = '';
        el.appendChild(svg);
      });
    } catch {
      console.info('[SVGManager] Sprite no encontrado — se usan fallbacks.');
    }
  },
};

/* ═══ 2. NAVEGACIÓN ═══ */
function initNavigation() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const closeBtn  = document.getElementById('close-menu');
  const menu      = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting)
        document.querySelectorAll('.nav-link').forEach(link => {
          link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? '#22c55e' : '';
        });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));

  hamburger?.addEventListener('click', openMobileMenu);
  closeBtn?.addEventListener('click', closeMobileMenu);
  menu?.addEventListener('click', e => { if (e.target === menu) closeMobileMenu(); });
}

function openMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.remove('hidden');
  requestAnimationFrame(() => menu.classList.add('open'));
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.remove('open');
  setTimeout(() => menu.classList.add('hidden'), 350);
  document.body.style.overflow = '';
}

/* ═══ 3. MODAL DE RESERVA ═══ */
let bookingStep = 1;
let bookingData = { service: '', date: '', time: '', name: '', email: '', phone: '', notes: '' };

function openBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  const dateInput = document.getElementById('bk-date');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  goToBookingStep(1);
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  setTimeout(() => { goToBookingStep(1); resetBookingForm(); }, 300);
}

function bookingNextStep(step) {
  if (step > bookingStep) {
    if (bookingStep === 1 && !bookingData.service) { showToast('Por favor selecciona un servicio.'); return; }
    if (bookingStep === 2) {
      const date = document.getElementById('bk-date')?.value;
      if (!date)             { showToast('Por favor selecciona una fecha.'); return; }
      if (!bookingData.time) { showToast('Por favor selecciona una hora.');  return; }
      bookingData.date = date;
    }
  }
  goToBookingStep(step);
}

function goToBookingStep(step) {
  [1, 2, 3].forEach(s => document.getElementById(`booking-step-${s}`)?.classList.toggle('hidden', s !== step));
  const labels = { 1: 'Paso 1 de 3 — Elige tu servicio', 2: 'Paso 2 de 3 — Fecha y hora', 3: 'Paso 3 de 3 — Tus datos' };
  const lbl = document.getElementById('modal-step-label');
  if (lbl && labels[step]) lbl.textContent = labels[step];
  [1, 2, 3].forEach(s => {
    const dot = document.getElementById(`step-dot-${s}`);
    if (dot) dot.className = 'step-indicator ' + (s < step ? 'done' : s === step ? 'current' : 'pending');
  });
  bookingStep = step;
}

function selectService(card) {
  document.querySelectorAll('.service-radio-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  bookingData.service = card.dataset.service;
}

function selectTime(btn) {
  document.querySelectorAll('.time-slot').forEach(t => { t.style.borderColor = ''; t.style.backgroundColor = ''; t.style.color = ''; });
  btn.style.borderColor = '#a855f7';
  btn.style.backgroundColor = '#faf5ff';
  btn.style.color = '#7e22ce';
  bookingData.time = btn.textContent.trim();
}

function submitBooking() {
  const name  = document.getElementById('bk-name')?.value.trim();
  const email = document.getElementById('bk-email')?.value.trim();
  if (!name)  { showToast('Por favor introduce tu nombre.'); return; }
  if (!email) { showToast('Por favor introduce tu email.');  return; }
  bookingData = { ...bookingData, name, email,
    phone: document.getElementById('bk-phone')?.value.trim(),
    notes: document.getElementById('bk-notes')?.value.trim() };
  [1, 2, 3].forEach(s => document.getElementById(`booking-step-${s}`)?.classList.add('hidden'));
  document.getElementById('booking-confirm')?.classList.remove('hidden');
  const lbl = document.getElementById('modal-step-label');
  if (lbl) lbl.textContent = '¡Confirmado!';
}

function resetBookingForm() {
  bookingData = { service: '', date: '', time: '', name: '', email: '', phone: '', notes: '' };
  document.querySelectorAll('.service-radio-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.time-slot').forEach(t => { t.style.borderColor = ''; t.style.backgroundColor = ''; t.style.color = ''; });
  ['bk-date', 'bk-name', 'bk-email', 'bk-phone', 'bk-notes'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('booking-confirm')?.classList.add('hidden');
}

function showToast(msg) {
  document.getElementById('cg-toast')?.remove();
  const toast = document.createElement('div');
  toast.id = 'cg-toast';
  toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#ef4444;color:#fff;padding:.75rem 1.5rem;border-radius:999px;font-weight:600;font-size:.875rem;z-index:100;box-shadow:0 8px 24px rgba(239,68,68,.4);';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('booking-modal')?.addEventListener('click', e => { if (e.target.id === 'booking-modal') closeBookingModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeBookingModal(); closeCrewModal(); } });
});

/* ═══ 4. FILTRO PORTFOLIO ═══ */
function filterPortfolio(category, activeBtn) {
  document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
  if (activeBtn) activeBtn.classList.add('active');
  document.querySelectorAll('#portfolio-grid [data-category]').forEach(card => {
    const match = category === 'all' || card.dataset.category === category;
    card.style.transition = 'opacity .3s, transform .3s';
    card.style.opacity = match ? '1' : '0';
    card.style.transform = match ? 'scale(1)' : 'scale(.95)';
    if (!match) setTimeout(() => { if (card.dataset.category !== category) card.style.display = 'none'; }, 280);
    else card.style.display = '';
  });
}

/* ═══ 5. REPRODUCTOR ═══ */
const MusicPlayer = {
  tracks: [
    { file: 'DR4M4TURG0-ZOLTRAAK.mp3',                   title: 'ZOLTRAAK',                        artist: 'DR4M4TURG0',  emoji: '⚡', cat: 'produccion', gradient: ['#1e1b4b', '#4c1d95'] },
    { file: 'Dr4m4turg0-BreakbeatAndalu.mp3',             title: 'Breakbeat Andalu',                 artist: 'Dr4m4turg0',  emoji: '🎸', cat: 'produccion', gradient: ['#22c55e', '#16a34a'] },
    { file: 'Dr4m4turg0-C4NN4BI$.mp3',                   title: 'C4NN4BI$',                        artist: 'Dr4m4turg0',  emoji: '🌿', cat: 'produccion', gradient: ['#166534', '#15803d'] },
    { file: 'Dr4m4turg0-M4TRIX.mp3',                     title: 'M4TRIX',                          artist: 'Dr4m4turg0',  emoji: '🎹', cat: 'produccion', gradient: ['#c084fc', '#a855f7'] },
    { file: 'KAILAS -LA_VIE_N_NOIR .mp3',                title: 'LA VIE N NOIR',                   artist: 'KAILAS',      emoji: '🎶', cat: 'produccion', gradient: ['#111827', '#374151'] },
    { file: 'Krono-Calabobo.mp3',                         title: 'Calabobo',                        artist: 'Krono',       emoji: '🎛️', cat: 'produccion', gradient: ['#4ade80', '#16a34a'] },
    { file: 'Krono-Hakai.mp3',                            title: 'Hakai',                           artist: 'Krono',       emoji: '🥁', cat: 'produccion', gradient: ['#86efac', '#22c55e'] },
    { file: 'SESEW-ALGO-ESTÁ-CAMBIANDO.mp3',             title: 'Algo Está Cambiando',             artist: 'SESEW',       emoji: '🎤', cat: 'produccion', gradient: ['#22c55e', '#a855f7'] },
    { file: 'SESEW-LA VOZ DE MI CEREBRO FT. FURIUS.mp3', title: 'La Voz de mi Cerebro ft. Furius', artist: 'SESEW',       emoji: '🎙️', cat: 'produccion', gradient: ['#a855f7', '#6d28d9'] },
  ],
  audio: null, currentIndex: 0, isPlaying: false,

  init() {
    this.audio = new Audio();
    this.audio.volume = 0.7;
    this.currentIndex = Math.floor(Math.random() * this.tracks.length);
    this.audio.addEventListener('ended',      () => this.next());
    this.audio.addEventListener('timeupdate', () => this._updateProgress());
    document.getElementById('player-progress-bar')?.addEventListener('click', e => {
      const r = e.currentTarget.getBoundingClientRect();
      if (this.audio.duration) this.audio.currentTime = ((e.clientX - r.left) / r.width) * this.audio.duration;
    });
    this._loadTrack(this.currentIndex, false);
    document.addEventListener('click', () => { if (!this.isPlaying) this.play(); }, { once: true });
    this.play();
  },

  _loadTrack(idx, autoPlay = true) {
    this.audio.src = encodeURI(`sound/${this.tracks[idx].file}`);
    this.audio.load();
    this._updateUI();
    this._syncCards();
    if (autoPlay) this.play();
  },

  _updateUI() {
    const t = this.tracks[this.currentIndex];
    const titleEl  = document.getElementById('player-track-name');
    const artistEl = document.getElementById('player-artist');
    if (titleEl)  titleEl.textContent  = t.title;
    if (artistEl) artistEl.textContent = t.artist;
    document.getElementById('player-icon-play') ?.classList.toggle('hidden',  this.isPlaying);
    document.getElementById('player-icon-pause')?.classList.toggle('hidden', !this.isPlaying);
    document.querySelectorAll('#player-wave .audio-bar').forEach(b => {
      b.style.animationPlayState = this.isPlaying ? 'running' : 'paused';
    });
  },

  _updateProgress() {
    const p = document.getElementById('player-progress');
    if (p && this.audio.duration) p.style.width = (this.audio.currentTime / this.audio.duration * 100) + '%';
  },

  _syncCards() {
    const file = this.tracks[this.currentIndex].file;
    document.querySelectorAll('.portfolio-card').forEach(card => {
      const active = card.dataset.audio === file && this.isPlaying;
      const btn  = card.querySelector('.play-btn');
      const wave = card.querySelector('[data-player]');
      if (btn) { btn.dataset.playing = active ? 'true' : 'false'; btn.innerHTML = active ? '⏸' : '▶'; }
      wave?.querySelectorAll('.audio-bar').forEach(b => { b.style.animationPlayState = active ? 'running' : 'paused'; });
    });
  },

  play()   { this.audio.play().catch(() => {}); this.isPlaying = true;  this._updateUI(); this._syncCards(); },
  pause()  { this.audio.pause();                this.isPlaying = false; this._updateUI(); this._syncCards(); },
  toggle() { this.isPlaying ? this.pause() : this.play(); },
  next()   { this.currentIndex = (this.currentIndex + 1) % this.tracks.length; this._loadTrack(this.currentIndex); },
  prev()   {
    if (this.audio.currentTime > 3) this.audio.currentTime = 0;
    else { this.currentIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length; this._loadTrack(this.currentIndex); }
  },
  playByFile(f) {
    const i = this.tracks.findIndex(t => t.file === f);
    if (i !== -1) { this.currentIndex = i; this._loadTrack(i); } else this.play();
  },
};

function playerToggle() { MusicPlayer.toggle(); }
function playerNext()   { MusicPlayer.next();   }
function playerPrev()   { MusicPlayer.prev();   }
function togglePlay(btn) {
  const file = btn.closest('.portfolio-card')?.dataset.audio;
  if (btn.dataset.playing === 'true') MusicPlayer.pause();
  else if (file) MusicPlayer.playByFile(file);
  else MusicPlayer.play();
}

/* ═══ 6. PORTFOLIO CARDS ═══ */
function renderPortfolioCards() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;
  grid.innerHTML = MusicPlayer.tracks.map(t => `
    <div class="portfolio-card" data-category="${t.cat}" data-audio="${t.file}">
      <div class="h-40 flex items-center justify-center relative overflow-hidden"
           style="background:linear-gradient(135deg,${t.gradient[0]},${t.gradient[1]})">
        <span class="text-5xl opacity-60">${t.emoji}</span>
        <div class="absolute bottom-3 left-3"><span class="badge-green text-xs">Producción</span></div>
      </div>
      <div class="p-5">
        <h4 class="font-bold text-gray-900 mb-0.5">${t.title}</h4>
        <p class="text-xs text-purple-500 font-semibold mb-3">${t.artist}</p>
        <div class="flex items-center justify-between">
          <div class="flex items-end gap-1 h-6" data-player>
            ${'<div class="audio-bar" style="animation-play-state:paused"></div>'.repeat(5)}
          </div>
          <button class="play-btn w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs"
                  onclick="togglePlay(this)" aria-label="Reproducir">▶</button>
        </div>
      </div>
    </div>`).join('');
}

/* ═══ 7. CREW ═══ */
const CREW_DATA = [
  { id: 'krono',      name: 'Krono',         badge: '🎛️', role: 'Productor / Beatmaker',  gradient: ['#22c55e', '#16a34a'], bio: 'Arquitecto de ritmos. Lleva años construyendo el sonido de Changos Garden desde la raíz, mezclando lo orgánico con lo electrónico sin perder la identidad.' },
  { id: 'kailas',     name: 'Kailas',         badge: '🎶', role: 'Compositor / Artista',   gradient: ['#a855f7', '#7e22ce'], bio: 'Melodías que duelen y beats que elevan. Kailas firma cada proyecto con una sensibilidad única y una visión artística sin límites que atraviesa géneros.' },
  { id: 'ADDN',       name: 'ADDN',           badge: '🎚️', role: 'Ingeniero de Sonido',    gradient: ['#22c55e', '#a855f7'], bio: 'Detrás de cada mezcla limpia hay horas de trabajo invisible. ADDN domina la técnica con precisión quirúrgica y un oído que capta lo que nadie más escucha.' },
  { id: 'anisakis',   name: 'AnisakisSound',  badge: '🔊', role: 'Productor / DJ',          gradient: ['#86efac', '#22c55e'], bio: 'Del estudio al dancefloor. Mueve multitudes con un sonido que viene directo de las tripas del underground y llega a todos los sistemas de sonido.' },
  { id: 'montihouse', name: 'Montihouse',     badge: '🏠', role: 'Productor / Diseñador',  gradient: ['#c084fc', '#a855f7'], bio: 'Sonido con identidad visual. Construye mundos combinando producción musical y dirección de arte, donde cada proyecto tiene su propio universo.' },
  { id: 'jamaka',     name: 'JamakaSound',    badge: '🥁', role: 'Productor / Beatmaker',  gradient: ['#4ade80', '#16a34a'], bio: 'El groove lo lleva en los huesos. Produce beats que no dejan sitio para quedarse quieto, con una percusión que se siente antes de que llegue el drop.' },
  { id: 'ravekid',    name: 'RaveKid',        badge: '⚡', role: 'DJ / Productor',          gradient: ['#a855f7', '#6d28d9'], bio: 'Energía pura en cada set. Conecta el mundo de la música electrónica con la producción de estudio sin perder ni un decibelio de intensidad.' },
  { id: 'sesew',      name: 'SeseW',          badge: '🎤', role: 'Artista / MC',            gradient: ['#22c55e', '#16a34a'], bio: 'Palabras que impactan, flow que no se olvida. Pone voz a las ideas más salvajes del estudio con una pluma afilada que mezcla calle, cultura y arte.' },
  { id: 'warco',      name: 'Warco$',         badge: '💫', role: 'Productor / Artista',     gradient: ['#fbbf24', '#d97706'], bio: 'Calle y estudio en partes iguales. Trae una perspectiva cruda y auténtica que da carácter propio a cada producción y no suena a nada de lo que ya existe.' },
  { id: 'thepdk',     name: 'THEPDK',         badge: '🧠', role: 'Productor / Compositor', gradient: ['#86efac', '#a855f7'], bio: 'Música con cerebro. Diseña estructuras sonoras complejas que suenan simples — y eso es lo más difícil de conseguir. Cada detalle está pensado dos veces.' },
];

function renderCrewCards() {
  const grid = document.getElementById('crew-grid');
  if (!grid) return;
  grid.innerHTML = CREW_DATA.map(m => `
    <div class="crew-card reveal" onclick="openCrewModal('${m.id}')">
      <div class="crew-card-img" style="background:linear-gradient(135deg,${m.gradient[0]},${m.gradient[1]})">
        <span class="text-5xl">${m.badge}</span>
      </div>
      <div class="crew-card-info"><h3>${m.name}</h3><p>${m.role}</p></div>
    </div>`).join('');
}

function openCrewModal(id) {
  const m = CREW_DATA.find(x => x.id === id);
  if (!m) return;
  document.getElementById('crew-modal-emoji').textContent = m.badge;
  document.getElementById('crew-modal-name').textContent  = m.name;
  document.getElementById('crew-modal-badge').textContent = m.badge;
  document.getElementById('crew-modal-role').textContent  = m.role;
  document.getElementById('crew-modal-bio').textContent   = m.bio;
  document.getElementById('crew-modal-header').style.background = `linear-gradient(135deg,${m.gradient[0]},${m.gradient[1]})`;
  const modal = document.getElementById('crew-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeCrewModal() {
  const modal = document.getElementById('crew-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

function handleCrewBackdrop(e) {
  if (e.target === document.getElementById('crew-modal')) closeCrewModal();
}

/* ═══ 8. FORMULARIO DE CONTACTO ═══ */
function submitContactForm(e) {
  e.preventDefault();
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn     = form.querySelector('button[type="submit"]');
  const name    = document.getElementById('cf-name')?.value.trim();
  const email   = document.getElementById('cf-email')?.value.trim();
  const message = document.getElementById('cf-message')?.value.trim();
  if (!name || !email || !message) return;
  btn.textContent = 'Enviando…';
  btn.disabled = true;
  setTimeout(() => { form.classList.add('hidden'); success.classList.remove('hidden'); }, 1000);
}

/* ═══ 9. SCROLL REVEAL ═══ */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

/* ═══ 10. MARQUEE ═══ */
function ensureMarqueeAnimation() {
  if (document.getElementById('cg-marquee-style')) return;
  const style = document.createElement('style');
  style.id = 'cg-marquee-style';
  style.textContent = '@keyframes marqueeScroll{0%{transform:translateX(0%)}100%{transform:translateX(-50%)}}';
  document.head.appendChild(style);
}

/* ═══ 11. MONO DANCER — spritesheet 6×6 = 36 frames ═══ */
const MonoDancer = {
  COLS: 6, ROWS: 6, TOTAL: 36, MS_PER_FRAME: 90, frame: 0, el: null,
  init() {
    this.el = document.getElementById('mono-dancer');
    if (!this.el) return;
    setInterval(() => {
      const col = this.frame % this.COLS;
      const row = Math.floor(this.frame / this.COLS);
      this.el.style.backgroundPosition = `${col === 0 ? 0 : (col / (this.COLS - 1)) * 100}% ${row === 0 ? 0 : (row / (this.ROWS - 1)) * 100}%`;
      this.frame = (this.frame + 1) % this.TOTAL;
    }, this.MS_PER_FRAME);
  },
};

/* ═══ INIT ═══ */
document.addEventListener('DOMContentLoaded', () => {
  ensureMarqueeAnimation();
  renderPortfolioCards();
  renderCrewCards();
  initNavigation();
  initScrollReveal();
  SVGManager.init();
  MusicPlayer.init();
  MonoDancer.init();
  console.log('%c🌿 Changos Garden Studios — cargado ✓', 'color:#22c55e;font-weight:bold;font-size:14px;');
});
