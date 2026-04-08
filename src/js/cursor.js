/* ============================================================
   CURSOR — custom dot + ring cursor
   ============================================================ */

import { CONFIG } from './config.js';

const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
}, { passive: true });

(function cursorLoop() {
  rx += (mx - rx) * CONFIG.cursorLerp;
  ry += (my - ry) * CONFIG.cursorLerp;
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(cursorLoop);
})();

document.querySelectorAll('a, .work__card, .timeline__clip, .stat, .marquee__item, .featured__card, .gallery__item, .gallery__filter').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring?.classList.add('cursor-ring--big');
    dot?.classList.add('cursor-dot--hot');
  });
  el.addEventListener('mouseleave', () => {
    ring?.classList.remove('cursor-ring--big');
    dot?.classList.remove('cursor-dot--hot');
  });
});
