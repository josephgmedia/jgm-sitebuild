import { CONFIG } from './config.js';
import gsap from 'gsap';

export function initStats() {
  // ── STATS block slide in (desktop only) ──
  if (window.innerWidth >= CONFIG.mobileBreakpoint) {
    gsap.from('#about-stats .stat', {
      opacity: 0, y: 30, duration: .8, ease: 'power3.out', stagger: CONFIG.statsStagger,
      scrollTrigger: { trigger: '#about-stats', start: 'top 80%' }
    });
  }

  // ── STATS — one-at-a-time flip (staggered) ──
  const statCards = document.querySelectorAll('#about-stats .stat');
  let statDelay = null;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const hasTouch = 'ontouchstart' in window;

  statCards.forEach(card => {
    // Pointer devices: hover to flip
    if (hasHover) {
      card.addEventListener('mouseenter', () => {
        clearTimeout(statDelay);
        const flipped = document.querySelector('#about-stats .stat.is-flipped');
        if (flipped && flipped !== card) {
          flipped.classList.remove('is-flipped');
          statDelay = setTimeout(() => card.classList.add('is-flipped'), CONFIG.statFlipDelay);
        } else if (!flipped) {
          card.classList.add('is-flipped');
        }
      });
      card.addEventListener('mouseleave', () => {
        clearTimeout(statDelay);
        card.classList.remove('is-flipped');
      });
    }
    // Touch devices: tap to toggle flip
    if (hasTouch) {
      card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
        const hint = document.getElementById('stat-tap-hint');
        if (hint) hint.classList.add('is-hidden');
      });
    }
    // Keyboard: Enter/Space to flip
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });

  // Add tap hint below stats on touch devices
  if (hasTouch && !hasHover) {
    const statsEl = document.getElementById('about-stats');
    if (statsEl) {
      const hint = document.createElement('span');
      hint.className = 'stat__tap-hint';
      hint.id = 'stat-tap-hint';
      hint.textContent = 'Tap to reveal';
      statsEl.insertAdjacentElement('afterend', hint);
    }
  }
}
