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

// ── Hero timeline animation ──────────────────
document.addEventListener('DOMContentLoaded', () => {

  const img1  = document.getElementById('img-1');
  const img2  = document.getElementById('img-2');
  const img3  = document.getElementById('img-3');
  const node1 = document.getElementById('node-1');
  const node2 = document.getElementById('node-2');
  const node3 = document.getElementById('node-3');
  const fill  = document.getElementById('timeline-fill');

  if (!img1) return;

  // Step 1 — imagen 1 + nodo 1
  setTimeout(() => {
    img1.classList.add('visible');
    node1.classList.add('active');
  }, 300);

  // Step 2 — línea + imagen 2 + nodo 2
  setTimeout(() => {
    fill.style.width = '50%';
    setTimeout(() => {
      img2.classList.add('visible');
      node2.classList.add('active');
    }, 400);
  }, 900);

  // Step 3 — línea + imagen 3 + nodo 3
  setTimeout(() => {
    fill.style.width = '100%';
    setTimeout(() => {
      img3.classList.add('visible');
      node3.classList.add('active');
    }, 400);
  }, 1700);

});
