import { CONFIG } from './config.js';
import gsap from 'gsap';
import { wordReveal } from './word-reveal.js';

export function initContactAnim() {
  wordReveal('#contact-headline');

  // ── CONTACT ──
  gsap.to('#contact-right', {
    opacity: 1, y: 0, duration: CONFIG.contactRevealDuration, ease: 'power3.out',
    scrollTrigger: { trigger: '#contact', start: 'top 72%' }
  });
}
