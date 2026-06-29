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
