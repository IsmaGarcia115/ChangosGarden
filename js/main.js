/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 *  CHANGOS GARDEN STUDIOS — main.js
 *  Tailwind CSS + Vanilla JS
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Sections:
 *  1. SVGManager        — loads & injects SVG assets from sprite
 *  2. Navigation        — sticky nav + hamburger menu
 *  3. Booking Modal     — multi-step booking flow
 *  4. Portfolio Filter  — category filtering
 *  5. Shop Tabs         — bases / merch toggle
 *  6. Audio Player      — portfolio track play toggle
 *  7. Contact Form      — form submission handler
 *  8. Scroll Reveal     — Intersection Observer animations
 *  9. Init              — bootstraps everything
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════
   1. SVG ASSET MANAGER
   ═══════════════════════════════════════════════════════════════
   Loads assets/svg/sprite.svg and injects the three asset types:
     • Background  → #svg-bg-slot
     • Character   → #svg-character-slot  (gets float animation)
     • Icons       → [data-svg-icon="icon-name"] placeholders

   SVG sprite structure expected (see assets/svg/README):
   ┌─────────────────────────────────────────────────────────────┐
   │ <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
   │   <defs>
   │     <symbol id="cg-background" viewBox="...">...</symbol>
   │     <symbol id="cg-character"  viewBox="...">...</symbol>
   │     <symbol id="icon-production"  viewBox="...">...</symbol>
   │     <symbol id="icon-master"      viewBox="...">...</symbol>
   │     <symbol id="icon-video"       viewBox="...">...</symbol>
   │     <symbol id="icon-instagram"   viewBox="...">...</symbol>
   │     <symbol id="icon-tiktok"      viewBox="...">...</symbol>
   │     <symbol id="icon-youtube"     viewBox="...">...</symbol>
   │     ... (any extra icons)
   │   </defs>
   │ </svg>
   └─────────────────────────────────────────────────────────────┘
*/
const SVGManager = {
  spritePath: 'assets/svg/sprite.svg',
  loaded: false,

  /** Initialise: attempt to fetch the sprite and inject assets */
  async init() {
    try {
      const res = await fetch(this.spritePath);
      if (!res.ok) throw new Error('Sprite not found');

      const svgText = await res.text();

      // Inject sprite into the hidden container so <use> tags work
      const container = document.getElementById('svg-sprite-container');
      if (container) container.innerHTML = svgText;

      this.loaded = true;
      this.injectBackground();
      this.injectCharacter();
      this.renderIcons();

      console.log('[SVGManager] Sprite loaded and assets injected ✓');
    } catch {
      console.info('[SVGManager] Sprite not found at', this.spritePath,
        '— Placeholder fallbacks remain active. Add assets/svg/sprite.svg when ready.');
    }
  },

  /**
   * Inject the background SVG into #svg-bg-slot.
   * Expects a <symbol id="cg-background"> in the sprite.
   */
  injectBackground() {
    // Only run if the sprite actually defines a #cg-background symbol.
    // Without it, we keep the CSS hero-bg-fallback (photo background) intact.
    if (!document.getElementById('cg-background')) return;

    const slot = document.getElementById('svg-bg-slot');
    if (!slot) return;

    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    bg.setAttribute('aria-hidden', 'true');
    bg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#cg-background');
    bg.appendChild(use);
    slot.appendChild(bg);

    // Remove the CSS fallback only after a real SVG background is injected
    const hero = document.getElementById('inicio');
    if (hero) hero.classList.remove('hero-bg-fallback');
  },

  /**
   * Inject the animated character SVG into #svg-character-slot.
   * Expects a <symbol id="cg-character"> in the sprite.
   * After injection, starts the blink animation if eyes are present.
   */
  injectCharacter() {
    const slot = document.getElementById('svg-character-slot');
    if (!slot) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'width:100%;height:100%;max-height:460px;';

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#cg-character');
    svg.appendChild(use);

    // Hide placeholder, show character
    const placeholder = document.getElementById('char-placeholder');
    if (placeholder) placeholder.style.display = 'none';

    slot.appendChild(svg);

    // Optional: blink animation for character eyes
    // Convention: <g id="char-eyes"> inside the symbol
    this._startBlinkAnimation(svg);
  },

  /** Start a blink interval if char-eyes element is present */
  _startBlinkAnimation(svgEl) {
    const eyes = svgEl.querySelector('#char-eyes');
    if (!eyes) return;
    setInterval(() => {
      eyes.style.transform = 'scaleY(0.08)';
      eyes.style.transformOrigin = 'center';
      setTimeout(() => { eyes.style.transform = 'scaleY(1)'; }, 100);
    }, 3500);
  },

  /**
   * Replace [data-svg-icon] fallback elements with proper <svg><use> tags.
   * Each element needs data-svg-icon="icon-name" matching a sprite symbol id.
   */
  renderIcons() {
    document.querySelectorAll('[data-svg-icon]').forEach(el => {
      const iconId = el.dataset.svgIcon;
      if (!iconId) return;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.cssText = 'width:1em;height:1em;vertical-align:middle;';

      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', `#${iconId}`);
      svg.appendChild(use);

      // Replace fallback content
      el.innerHTML = '';
      el.appendChild(svg);
    });
  },

  /**
   * PUBLIC API — use these methods to manually inject SVG content
   * without using the sprite, e.g. for inline SVG strings.
   */

  /** Manually set the background from an SVG string */
  setBackground(svgString) {
    const slot = document.getElementById('svg-bg-slot');
    if (!slot) return;
    slot.innerHTML = svgString;
    const hero = document.getElementById('inicio');
    if (hero) hero.classList.remove('hero-bg-fallback');
  },

  /** Manually set the character from an SVG string */
  setCharacter(svgString) {
    const slot = document.getElementById('svg-character-slot');
    if (!slot) return;
    const placeholder = document.getElementById('char-placeholder');
    if (placeholder) placeholder.style.display = 'none';
    slot.innerHTML = svgString;
    const injected = slot.querySelector('svg');
    if (injected) {
      injected.style.cssText = 'width:100%;height:100%;max-height:460px;';
      this._startBlinkAnimation(injected);
    }
  },

  /** Manually set a single icon by its container selector */
  setIcon(selector, svgString) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = svgString;
  },
};


/* ═══════════════════════════════════════════════════════════════
   2. NAVIGATION
   ═══════════════════════════════════════════════════════════════ */
function initNavigation() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const menu      = document.getElementById('mobile-menu');
  const closeBtn  = document.getElementById('close-menu');

  // Sticky scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Active nav link on scroll
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? '#22c55e' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  // Mobile menu toggle
  if (hamburger) hamburger.addEventListener('click', openMobileMenu);
  if (closeBtn)  closeBtn.addEventListener('click',  closeMobileMenu);

  // Close on backdrop click
  menu?.addEventListener('click', e => {
    if (e.target === menu) closeMobileMenu();
  });
}

function openMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  menu.classList.remove('hidden');
  requestAnimationFrame(() => menu.classList.add('open'));
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (!menu) return;
  menu.classList.remove('open');
  setTimeout(() => menu.classList.add('hidden'), 350);
  document.body.style.overflow = '';
}


/* ═══════════════════════════════════════════════════════════════
   3. BOOKING MODAL
   ═══════════════════════════════════════════════════════════════ */
let bookingCurrentStep = 1;
let bookingData = { service: '', date: '', time: '', name: '', email: '', phone: '', notes: '' };

function openBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  // Set min date to today
  const dateInput = document.getElementById('bk-date');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  // Reset to step 1
  goToBookingStep(1);
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  // Reset after animation
  setTimeout(() => {
    goToBookingStep(1);
    resetBookingForm();
  }, 300);
}

function bookingNextStep(step) {
  // Validate current step before advancing
  if (step > bookingCurrentStep) {
    if (bookingCurrentStep === 1 && !bookingData.service) {
      showModalError('Por favor selecciona un servicio.');
      return;
    }
    if (bookingCurrentStep === 2) {
      const date = document.getElementById('bk-date')?.value;
      if (!date) { showModalError('Por favor selecciona una fecha.'); return; }
      if (!bookingData.time) { showModalError('Por favor selecciona una hora.'); return; }
      bookingData.date = date;
    }
  }
  goToBookingStep(step);
}

function goToBookingStep(step) {
  [1, 2, 3].forEach(s => {
    const el = document.getElementById(`booking-step-${s}`);
    if (el) el.classList.toggle('hidden', s !== step);
  });

  const labels = {
    1: 'Paso 1 de 3 — Elige tu servicio',
    2: 'Paso 2 de 3 — Fecha y hora',
    3: 'Paso 3 de 3 — Tus datos',
  };
  const stepLabel = document.getElementById('modal-step-label');
  if (stepLabel && labels[step]) stepLabel.textContent = labels[step];

  // Update step indicators
  [1, 2, 3].forEach(s => {
    const dot = document.getElementById(`step-dot-${s}`);
    if (!dot) return;
    dot.className = 'step-indicator ' + (s < step ? 'done' : s === step ? 'current' : 'pending');
  });

  bookingCurrentStep = step;
}

function selectService(card) {
  document.querySelectorAll('.service-radio-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  bookingData.service = card.dataset.service;
}

function selectTime(btn) {
  document.querySelectorAll('.time-slot').forEach(t => {
    t.style.borderColor = '';
    t.style.backgroundColor = '';
    t.style.color = '';
  });
  btn.style.borderColor = '#a855f7';
  btn.style.backgroundColor = '#faf5ff';
  btn.style.color = '#7e22ce';
  bookingData.time = btn.textContent.trim();
}

function submitBooking() {
  const name  = document.getElementById('bk-name')?.value.trim();
  const email = document.getElementById('bk-email')?.value.trim();

  if (!name)  { showModalError('Por favor introduce tu nombre.'); return; }
  if (!email) { showModalError('Por favor introduce tu email.'); return; }

  bookingData.name  = name;
  bookingData.email = email;
  bookingData.phone = document.getElementById('bk-phone')?.value.trim();
  bookingData.notes = document.getElementById('bk-notes')?.value.trim();

  // Hide steps, show confirmation
  [1, 2, 3].forEach(s => {
    const el = document.getElementById(`booking-step-${s}`);
    if (el) el.classList.add('hidden');
  });
  document.getElementById('booking-confirm')?.classList.remove('hidden');
  document.getElementById('modal-step-label').textContent = '¡Confirmado!';

  // Log data (replace with actual backend/email integration)
  console.log('[Booking] Request submitted:', bookingData);
}

function resetBookingForm() {
  bookingData = { service: '', date: '', time: '', name: '', email: '', phone: '', notes: '' };
  document.querySelectorAll('.service-radio-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.time-slot').forEach(t => {
    t.style.borderColor = '';
    t.style.backgroundColor = '';
    t.style.color = '';
  });
  ['bk-date','bk-name','bk-email','bk-phone','bk-notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('booking-confirm')?.classList.add('hidden');
}

function showModalError(msg) {
  // Simple inline toast
  const existing = document.getElementById('modal-error-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'modal-error-toast';
  toast.style.cssText = `
    position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
    background:#ef4444;color:#fff;padding:0.75rem 1.5rem;
    border-radius:999px;font-weight:600;font-size:0.875rem;
    z-index:100;box-shadow:0 8px 24px rgba(239,68,68,0.4);
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('booking-modal');
  modal?.addEventListener('click', e => {
    if (e.target === modal) closeBookingModal();
  });

  // Close with Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeBookingModal();
  });
});


/* ═══════════════════════════════════════════════════════════════
   4. PORTFOLIO FILTER
   ═══════════════════════════════════════════════════════════════ */
function filterPortfolio(category, activeBtn) {
  // Update tab buttons
  document.querySelectorAll('[data-filter]').forEach(btn => btn.classList.remove('active'));
  if (activeBtn) activeBtn.classList.add('active');

  // Show/hide cards
  document.querySelectorAll('#portfolio-grid [data-category]').forEach(card => {
    const match = category === 'all' || card.dataset.category === category;
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    if (match) {
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
      card.style.display = '';
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (card.dataset.category !== category && category !== 'all') {
          card.style.display = 'none';
        }
      }, 280);
    }
  });
}


/* ═══════════════════════════════════════════════════════════════
   5. SHOP TABS
   ═══════════════════════════════════════════════════════════════ */
function switchShopTab(tab, activeBtn) {
  document.querySelectorAll('[data-shop-tab]').forEach(btn => btn.classList.remove('active'));
  if (activeBtn) activeBtn.classList.add('active');

  document.getElementById('shop-bases').classList.toggle('hidden', tab !== 'bases');
  document.getElementById('shop-merch').classList.toggle('hidden', tab !== 'merch');
}


/* ═══════════════════════════════════════════════════════════════
   6. MUSIC PLAYER — playlist global + controles hero
   ═══════════════════════════════════════════════════════════════ */
const MusicPlayer = {
  tracks: [
    { file: 'DR4M4TURG0-ZOLTRAAK.mp3',                      title: 'ZOLTRAAK',                        artist: 'DR4M4TURG0' },
    { file: 'Dr4m4turg0-BreakbeatAndalu.mp3',                title: 'Breakbeat Andalu',                 artist: 'Dr4m4turg0'  },
    { file: 'Dr4m4turg0-C4NN4BI$.mp3',                      title: 'C4NN4BI$',                        artist: 'Dr4m4turg0'  },
    { file: 'Dr4m4turg0-M4TRIX.mp3',                        title: 'M4TRIX',                          artist: 'Dr4m4turg0'  },
    { file: 'KAILAS -LA_VIE_N_NOIR .mp3',                   title: 'LA VIE N NOIR',                   artist: 'KAILAS'      },
    { file: 'Krono-Calabobo.mp3',                            title: 'Calabobo',                        artist: 'Krono'       },
    { file: 'Krono-Hakai.mp3',                               title: 'Hakai',                           artist: 'Krono'       },
    { file: 'SESEW-ALGO-ESTÁ-CAMBIANDO.mp3',                title: 'Algo Está Cambiando',             artist: 'SESEW'       },
    { file: 'SESEW-LA VOZ DE MI CEREBRO FT. FURIUS.mp3',   title: 'La Voz de mi Cerebro ft. Furius', artist: 'SESEW'       },
  ],
  audio:        null,
  currentIndex: 0,
  isPlaying:    false,

  init() {
    this.audio = new Audio();
    this.audio.volume = 0.7;
    this.currentIndex = Math.floor(Math.random() * this.tracks.length);

    this.audio.addEventListener('ended',      () => this.next());
    this.audio.addEventListener('timeupdate', () => this._updateProgress());

    const bar = document.getElementById('player-progress-bar');
    if (bar) {
      bar.addEventListener('click', e => {
        const rect = bar.getBoundingClientRect();
        const pct  = (e.clientX - rect.left) / rect.width;
        if (this.audio.duration) this.audio.currentTime = pct * this.audio.duration;
      });
    }

    this._loadTrack(this.currentIndex, false);

    // Autoplay en primer click del usuario (política de navegadores)
    document.addEventListener('click', () => { if (!this.isPlaying) this.play(); }, { once: true });
    this.play();
  },

  _loadTrack(index, autoPlay = true) {
    const track    = this.tracks[index];
    this.audio.src = encodeURI(`sound/${track.file}`);
    this.audio.load();
    this._updateUI();
    this._syncPortfolioCards();
    if (autoPlay) this.play();
  },

  _updateUI() {
    const track = this.tracks[this.currentIndex];
    const titleEl  = document.getElementById('player-track-name');
    const artistEl = document.getElementById('player-artist');
    if (titleEl)  titleEl.textContent  = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    this._updatePlayBtn();
  },

  _updatePlayBtn() {
    const iconPlay  = document.getElementById('player-icon-play');
    const iconPause = document.getElementById('player-icon-pause');
    if (iconPlay)  iconPlay.classList.toggle('hidden',  this.isPlaying);
    if (iconPause) iconPause.classList.toggle('hidden', !this.isPlaying);
    document.querySelectorAll('#player-wave .audio-bar').forEach(bar => {
      bar.style.animationPlayState = this.isPlaying ? 'running' : 'paused';
    });
  },

  _updateProgress() {
    const prog = document.getElementById('player-progress');
    if (prog && this.audio.duration) {
      prog.style.width = (this.audio.currentTime / this.audio.duration * 100) + '%';
    }
  },

  _syncPortfolioCards() {
    const currentFile = this.tracks[this.currentIndex].file;
    document.querySelectorAll('.portfolio-card').forEach(card => {
      const btn      = card.querySelector('.play-btn');
      const wave     = card.querySelector('[data-player]');
      const isActive = card.dataset.audio === currentFile && this.isPlaying;
      if (btn) { btn.dataset.playing = isActive ? 'true' : 'false'; btn.innerHTML = isActive ? '⏸' : '▶'; }
      wave?.querySelectorAll('.audio-bar').forEach(b => {
        b.style.animationPlayState = isActive ? 'running' : 'paused';
      });
    });
  },

  play() {
    this.audio.play().catch(() => {});
    this.isPlaying = true;
    this._updatePlayBtn();
    this._syncPortfolioCards();
  },

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this._updatePlayBtn();
    this._syncPortfolioCards();
  },

  toggle() { if (this.isPlaying) this.pause(); else this.play(); },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
    this._loadTrack(this.currentIndex);
  },

  prev() {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
    } else {
      this.currentIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
      this._loadTrack(this.currentIndex);
    }
  },

  playByFile(filename) {
    const idx = this.tracks.findIndex(t => t.file === filename);
    if (idx !== -1) { this.currentIndex = idx; this._loadTrack(idx); }
    else this.play();
  },
};

function playerToggle() { MusicPlayer.toggle(); }
function playerNext()   { MusicPlayer.next();   }
function playerPrev()   { MusicPlayer.prev();   }

function togglePlay(btn) {
  const card      = btn.closest('.portfolio-card');
  const filename  = card?.dataset.audio;
  const isPlaying = btn.dataset.playing === 'true';

  if (isPlaying) {
    MusicPlayer.pause();
  } else if (filename) {
    MusicPlayer.playByFile(filename);
  } else {
    MusicPlayer.play();
  }
}


/* ═══════════════════════════════════════════════════════════════
   7. CREW MODAL
   ═══════════════════════════════════════════════════════════════ */
const CREW_DATA = [
  {
    id: 'krono',
    name: 'Krono',
    badge: '🎛️',
    role: 'Productor / Beatmaker',
    gradient: ['#22c55e', '#16a34a'],
    bio: 'Arquitecto de ritmos. Lleva años construyendo el sonido de Changos Garden desde la raíz, con un estilo que mezcla lo orgánico y lo electrónico sin perder la identidad.',
  },
  {
    id: 'kailas',
    name: 'Kailas',
    badge: '🎶',
    role: 'Compositor / Artista',
    gradient: ['#a855f7', '#7e22ce'],
    bio: 'Melodías que duelen y beats que elevan. Kailas firma cada proyecto con una sensibilidad única y una visión artística sin límites que atraviesa géneros y formatos.',
  },
  {
    id: 'ADDN',
    name: 'ADDN',
    badge: '🎚️',
    role: 'Ingeniero de Sonido',
    gradient: ['#22c55e', '#a855f7'],
    bio: 'Detrás de cada mezcla limpia hay horas de trabajo invisible. ADDN domina la técnica con precisión quirúrgica y un oído que capta lo que nadie más escucha.',
  },
  {
    id: 'anisakis',
    name: 'AnisakisSound',
    badge: '🔊',
    role: 'Productor / DJ',
    gradient: ['#86efac', '#22c55e'],
    bio: 'Del estudio al dancefloor. AnisakisSound mueve multitudes con un sonido que viene directo de las tripas del underground y llega a todos los sistemas de sonido.',
  },
  {
    id: 'montihouse',
    name: 'Montihouse',
    badge: '🏠',
    role: 'Productor / Diseñador',
    gradient: ['#c084fc', '#a855f7'],
    bio: 'Sonido con identidad visual. Montihouse construye mundos completos combinando producción musical y dirección de arte, donde cada proyecto tiene su propio universo.',
  },
  {
    id: 'jamaka',
    name: 'JamakaSound',
    badge: '🥁',
    role: 'Productor / Beatmaker',
    gradient: ['#4ade80', '#16a34a'],
    bio: 'El groove lo lleva en los huesos. JamakaSound produce beats que no dejan sitio para quedarse quieto, con una percusión que se siente antes de que llegue el drop.',
  },
  {
    id: 'ravekid',
    name: 'RaveKid',
    badge: '⚡',
    role: 'DJ / Productor',
    gradient: ['#a855f7', '#6d28d9'],
    bio: 'Energía pura en cada set. RaveKid conecta el mundo de la música electrónica con la producción de estudio sin perder ni un decibelio de intensidad en el camino.',
  },
  {
    id: 'sesew',
    name: 'SeseW',
    badge: '🎤',
    role: 'Artista / MC',
    gradient: ['#22c55e', '#16a34a'],
    bio: 'Palabras que impactan, flow que no se olvida. SeseW pone voz a las ideas más salvajes del estudio con una pluma afilada que mezcla calle, cultura y arte.',
  },
  {
    id: 'warco',
    name: 'Warco$',
    badge: '💫',
    role: 'Productor / Artista',
    gradient: ['#fbbf24', '#d97706'],
    bio: 'Calle y estudio en partes iguales. Warco$ trae una perspectiva cruda y auténtica que da carácter propio a cada producción y no suena a nada de lo que ya existe.',
  },
  {
    id: 'thepdk',
    name: 'THEPDK',
    badge: '🧠',
    role: 'Productor / Compositor',
    gradient: ['#86efac', '#a855f7'],
    bio: 'Música con cerebro. THEPDK diseña estructuras sonoras complejas que suenan simples — y eso es lo más difícil de conseguir. Cada detalle está pensado dos veces.',
  },
];

function openCrewModal(id) {
  const member = CREW_DATA.find(m => m.id === id);
  if (!member) return;

  document.getElementById('crew-modal-emoji').textContent = member.badge;
  document.getElementById('crew-modal-name').textContent  = member.name;
  document.getElementById('crew-modal-badge').textContent = member.badge;
  document.getElementById('crew-modal-role').textContent  = member.role;
  document.getElementById('crew-modal-bio').textContent   = member.bio;
  document.getElementById('crew-modal-header').style.background =
    `linear-gradient(135deg, ${member.gradient[0]}, ${member.gradient[1]})`;

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

// Escape key support for crew modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCrewModal();
});


/* ═══════════════════════════════════════════════════════════════
   8. CONTACT FORM
   ═══════════════════════════════════════════════════════════════ */
function submitContactForm(event) {
  event.preventDefault();

  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const btn     = form.querySelector('button[type="submit"]');

  // Simple validation
  const name    = document.getElementById('cf-name')?.value.trim();
  const email   = document.getElementById('cf-email')?.value.trim();
  const message = document.getElementById('cf-message')?.value.trim();

  if (!name || !email || !message) return;

  // Simulate submission (replace with fetch/API call)
  btn.textContent = 'Enviando…';
  btn.disabled    = true;

  setTimeout(() => {
    form.classList.add('hidden');
    success.classList.remove('hidden');
    console.log('[Contact] Message submitted:', { name, email, message });
  }, 1000);
}


/* ═══════════════════════════════════════════════════════════════
   8. SCROLL REVEAL
   ═══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}


/* ═══════════════════════════════════════════════════════════════
   9. MARQUEE — re-inject keyframe if Tailwind CDN hasn't loaded it
   ═══════════════════════════════════════════════════════════════ */
function ensureMarqueeAnimation() {
  if (document.getElementById('cg-marquee-style')) return;
  const style = document.createElement('style');
  style.id = 'cg-marquee-style';
  style.textContent = `
    @keyframes marqueeScroll {
      0%   { transform: translateX(0%);   }
      100% { transform: translateX(-50%); }
    }
    @keyframes fadeUp {
      0%   { opacity:0; transform:translateY(12px); }
      100% { opacity:1; transform:translateY(0);    }
    }
  `;
  document.head.appendChild(style);
}


/* ═══════════════════════════════════════════════════════════════
   10. MONO DANCER — sprite sheet animation (6 cols × 3 rows = 18 frames)
       Sprite: assets/monoSprites.png — fondo transparente (tRNS)
   ═══════════════════════════════════════════════════════════════ */
const MonoDancer = {
  COLS: 6,
  ROWS: 6,
  TOTAL: 36,
  MS_PER_FRAME: 90,   // ~8 fps
  frame: 0,
  el: null,
  _timer: null,

  init() {
    this.el = document.getElementById('mono-dancer');
    if (!this.el) return;
    this._timer = setInterval(() => this._advance(), this.MS_PER_FRAME);
  },

  _advance() {
    const col = this.frame % this.COLS;
    const row = Math.floor(this.frame / this.COLS);
    const xPct = col === 0 ? 0 : (col / (this.COLS - 1)) * 100;
    const yPct = row === 0 ? 0 : (row / (this.ROWS - 1)) * 100;
    this.el.style.backgroundPosition = `${xPct}% ${yPct}%`;
    this.frame = (this.frame + 1) % this.TOTAL;
  },
};

/* ═══════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  ensureMarqueeAnimation();
  initNavigation();
  initScrollReveal();
  SVGManager.init();
  MusicPlayer.init();
  MonoDancer.init();

  console.log('%c🌿 Changos Garden Studios — cargado ✓', 'color:#22c55e;font-weight:bold;font-size:14px;');
});
