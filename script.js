// ── Nav scroll ──────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Hero load animation ─────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('crs-hero');
  setTimeout(() => hero.classList.add('loaded'), 100);
});

// ── Fade-up on scroll ───────────────────────
const fadeEls = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ── Flip stat cards on click (if desktop) ──
// (kept consistent with index.html behavior)