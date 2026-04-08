/* ============================================================
   NAV — scroll detection + mobile hamburger menu
   ============================================================ */

import { CONFIG } from './config.js';

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('nav--scrolled', scrollY > CONFIG.navScrollThreshold);
}, { passive: true });

// ── MOBILE NAV ──
const hamburger = document.getElementById('nav-hamburger');
const navClose = document.getElementById('nav-close');
const navOverlay = document.getElementById('nav-overlay');
if (hamburger && navOverlay) {
  function openNav() {
    document.body.classList.add('nav--open');
    hamburger.setAttribute('aria-expanded', 'true');
    navOverlay.setAttribute('aria-hidden', 'false');
    navClose?.focus();
  }
  function closeNav() {
    document.body.classList.remove('nav--open');
    hamburger.setAttribute('aria-expanded', 'false');
    navOverlay.setAttribute('aria-hidden', 'true');
    hamburger.focus();
  }
  hamburger.addEventListener('click', openNav);
  navClose?.addEventListener('click', closeNav);
  navOverlay.querySelectorAll('.nav__overlay-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });
  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('nav--open')) closeNav();
  });
}
