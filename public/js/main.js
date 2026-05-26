/* ============================================================
   PREPWISE AI — Main JavaScript
   Landing page interactions, counters, mobile menu, toasts
   ============================================================ */

// ─── Theme persistence (apply before render to avoid flash) ──
(function () {
  const saved = localStorage.getItem('prepwise-theme');
  if (saved === 'dark') document.documentElement.classList.add('dark-theme-preload');
})();

document.addEventListener('DOMContentLoaded', () => {

  // ── Apply saved theme ─────────────────────────────────────
  const savedTheme = localStorage.getItem('prepwise-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }

  // ── AOS animations ────────────────────────────────────────
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic'
    });
  }

  // ── Footer year ───────────────────────────────────────────
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // ── Animated counters ─────────────────────────────────────
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target')) || 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const tick = () => {
      current = Math.min(current + increment, target);
      const formatted = target >= 1000
        ? Math.floor(current).toLocaleString() + (target === 10000 ? '+' : '')
        : Math.floor(current) + (target === 95 ? '%' : '+');
      el.textContent = formatted;
      if (current < target) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statNumbers.forEach(el => observer.observe(el));
  }

  // ── Smooth scroll ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
      }
    });
  });

  // ── Mobile hamburger ──────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    // Close when clicking outside
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // ── Navbar scroll effect ──────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const updateNavbar = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  // ── Feature cards entrance stagger ───────────────────────
  const cards = document.querySelectorAll('.feature-card');
  if (cards.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.05}s`;
    });
  }
});

// ─── Toast Notification ───────────────────────────────────────
function showToast(message, type = 'success', duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  // Icon map
  const icons = {
    success: 'fa-circle-check',
    error:   'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info:    'fa-circle-info'
  };

  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.success}" style="color:var(--${type === 'error' ? 'danger' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'});font-size:1.1rem;flex-shrink:0;"></i>
    <span>${message}</span>
  `;
  toast.className = `toast ${type} show`;

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}
