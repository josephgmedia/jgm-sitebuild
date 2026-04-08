import { CONFIG } from './config.js';
import gsap from 'gsap';

export function wordReveal(selector, stagger = CONFIG.wordRevealStagger) {
  const el = document.querySelector(selector);
  if (!el) return;
  gsap.to(el.querySelectorAll('.word__inner'), {
    y: '0%', duration: CONFIG.wordRevealDuration, ease: 'power4.out', stagger,
    scrollTrigger: { trigger: el, start: 'top 80%' }
  });
}
