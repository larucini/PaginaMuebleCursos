// ── Nav scroll ──────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Fade-up on scroll ───────────────────────
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => observer.observe(el));

// ── Programa: acordeón de cards con panel de detalle ──
function initProgramaAccordion() {
  const entries = Array.from(document.querySelectorAll('.crs-programa-entry'));
  if (!entries.length) return;

  entries.forEach((entry) => {
    const btn = entry.querySelector('.crs-programa-item');
    btn.addEventListener('click', () => {
      const isOpen = entry.classList.contains('is-open');
      entry.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}
document.addEventListener('DOMContentLoaded', initProgramaAccordion);

// ── Carrusel de reseñas (loop infinito sin corte) ──
function initReviewsCarousel() {
  const track = document.getElementById('reviews-track');
  if (!track) return;

  const wrap    = track.parentElement;
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');

  // Clonamos la primera card al final y la última al principio,
  // así al "pasar" del extremo siempre se sigue avanzando en la misma dirección.
  const originalCards = Array.from(track.querySelectorAll('.crs-review-card'));
  const total = originalCards.length;

  const firstClone = originalCards[0].cloneNode(true);
  const lastClone  = originalCards[total - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');

  track.appendChild(firstClone);
  track.insertBefore(lastClone, originalCards[0]);

  const cards = Array.from(track.querySelectorAll('.crs-review-card'));
  // Ahora: cards[0] = clon de la última, cards[1..total] = reales, cards[total+1] = clon de la primera
  let index = 1;
  let isAnimating = false;

  function moveTo(i, withTransition = true) {
    track.style.transition = withTransition ? '' : 'none';
    if (!withTransition) track.offsetHeight; // fuerza reflow para que el "none" se aplique antes del salto
    const wrapWidth  = wrap.getBoundingClientRect().width;
    const cardWidth  = cards[i].getBoundingClientRect().width;
    const offsetLeft = cards[i].offsetLeft;
    const offset = offsetLeft - (wrapWidth - cardWidth) / 2;

    track.style.transform = `translateX(-${offset}px)`;
    cards.forEach((card, ci) => card.classList.toggle('active', ci === i));
  }

  function goNext() {
    if (isAnimating) return;
    isAnimating = true;
    index++;
    moveTo(index, true);
  }

  function goPrev() {
    if (isAnimating) return;
    isAnimating = true;
    index--;
    moveTo(index, true);
  }

  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;

    if (index === cards.length - 1) {
      // Llegamos al clon de la primera: saltamos sin animación a la primera real
      index = 1;
      moveTo(index, false);
    } else if (index === 0) {
      // Llegamos al clon de la última: saltamos sin animación a la última real
      index = total;
      moveTo(index, false);
    }
    isAnimating = false;
  });

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);

  window.addEventListener('resize', () => moveTo(index, false));
  window.addEventListener('load', () => moveTo(index, false));
  moveTo(index, false);
}
document.addEventListener('DOMContentLoaded', initReviewsCarousel);

// ── Hero: marquee vertical + sliders before/after (drag manual) ──
function initHeroMarquee() {
  const marquee = document.getElementById('hero-marquee');
  if (!marquee) return;
  const slides = Array.from(marquee.querySelectorAll('.crs-hero-slide'));

  // Pausar el loop mientras el mouse esté sobre el marquee
  marquee.addEventListener('mouseenter', () => marquee.classList.add('is-paused'));
  marquee.addEventListener('mouseleave', () => {
    marquee.classList.remove('is-paused');
    marquee.querySelectorAll('.crs-hero-slide-after-wrap').forEach(el => {
      el.style.clipPath = 'inset(0 50% 0 0)';
    });
    marquee.querySelectorAll('.crs-hero-slide-handle').forEach(el => {
      el.style.left = '50%';
    });
  });
  marquee.addEventListener('touchstart', () => marquee.classList.add('is-paused'), { passive: true });

  slides.forEach((slide) => {
    const afterWrap = slide.querySelector('.crs-hero-slide-after-wrap');
    const handle    = slide.querySelector('.crs-hero-slide-handle');
    let dragging = false;

    function setSplit(clientX) {
      const rect = slide.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      afterWrap.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + '%';
    }

    function onMove(e) {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSplit(clientX);
    }
    function stopDrag() {
      dragging = false;
      slide.classList.remove('is-dragging');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', stopDrag);
    }
    function startDrag(e) {
      dragging = true;
      slide.classList.add('is-dragging');
      marquee.classList.add('is-paused');
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSplit(clientX);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', stopDrag);
      e.preventDefault();
    }

    slide.addEventListener('mousedown', startDrag);
    slide.addEventListener('touchstart', startDrag, { passive: false });
  });
}
document.addEventListener('DOMContentLoaded', initHeroMarquee);

// ── Equipo: hover-swap entre instructores ─────
function initTeamSwap() {
  const root = document.getElementById('crs-team');
  if (!root) return;

  const nameButtons = Array.from(root.querySelectorAll('.crs-team-name'));
  const photoEl     = document.getElementById('crs-team-photo-img');
  const roleEl      = document.getElementById('crs-team-role');
  const statsEl     = document.getElementById('crs-team-stats');

  const instructors = [
    {
      name: 'Tomás Ferrero',
      photo: 'assets/tomas-ferrero.png',
      role: 'Maestro restaurador de mobiliario',
      stats: [
        { num: '+5', label: 'Años de<br>experiencia' },
        { num: 'Especialista', label: 'en estructuras y<br>uniones tradicionales', word: true },
        { num: '2019', label: 'Formando<br>restauradores' },
      ],
    },
    {
      name: 'Lucía Bianchi',
      photo: 'assets/lucia-bianchi.png',
      role: 'Diseñadora industrial y restauradora',
      stats: [
        { num: '+8', label: 'Años de<br>experiencia' },
        { num: 'Especialista', label: 'en diseño de<br>mobiliario funcional', word: true },
        { num: '2017', label: 'Formando<br>restauradores' },
      ],
    },
    {
      name: 'Santiago Ruíz',
      photo: 'assets/santiago-ruiz.png',
      role: 'Ebanista y especialista en maderas macizas',
      stats: [
        { num: '+10', label: 'Años de<br>experiencia' },
        { num: 'Especialista', label: 'en maderas macizas<br>y ebanistería fina', word: true },
        { num: '2016', label: 'Formando<br>restauradores' },
      ],
    },
  ];

  function renderStats(stats) {
    statsEl.innerHTML = stats.map(s => `
      <div class="crs-team-stat">
        <span class="crs-team-stat-num${s.word ? ' is-word' : ''}">${s.num}</span>
        <span class="crs-team-stat-label">${s.label}</span>
      </div>
    `).join('');
  }

  function setActive(i) {
    nameButtons.forEach((btn, bi) => btn.classList.toggle('is-active', bi === i));

    const data = instructors[i];
    // Fundido corto para que el cambio de contenido no se sienta como un corte.
    [photoEl, roleEl, statsEl].forEach(el => el.classList.add('crs-team-swap-fade'));

    setTimeout(() => {
      photoEl.src = data.photo;
      photoEl.alt = data.name;
      roleEl.textContent = data.role;
      renderStats(data.stats);
      [photoEl, roleEl, statsEl].forEach(el => el.classList.remove('crs-team-swap-fade'));
    }, 150);
  }

  nameButtons.forEach((btn, i) => {
    btn.addEventListener('mouseenter', () => setActive(i));
    btn.addEventListener('focus', () => setActive(i));
  });

  // Estado inicial: primer instructor.
  renderStats(instructors[0].stats);
}
document.addEventListener('DOMContentLoaded', initTeamSwap);
