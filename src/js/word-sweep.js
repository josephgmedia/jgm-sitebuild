import { CONFIG } from './config.js';
import gsap from 'gsap';

export function initWordSweep() {
  // ── ABOUT — word-by-word colour sweep ──
  ['#about-p1', '#about-p2', '#about-p3'].forEach(sel => {
    const p = document.querySelector(sel);
    if (!p) return;
    const words = p.innerHTML.split(' ');
    p.innerHTML = words.map(w => `<span class="word--light">${w}</span>`).join(' ');
    p.style.color = 'rgba(237,234,228,.6)';
    gsap.to(p.querySelectorAll('.word--light'), {
      color: 'rgba(237,234,228,1)',
      stagger: { each: CONFIG.wordSweepStagger },
      ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 75%', end: 'bottom 40%', scrub: CONFIG.wordSweepScrub }
    });
  });
}
