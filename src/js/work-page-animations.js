/* ============================================================
   Work Page — scroll-triggered entrance animations
   Per Emil Kowalski: stagger 50ms, translateY(8px), 300ms ease-out
   ============================================================ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONFIG } from './config.js';

gsap.registerPlugin(ScrollTrigger);

export function initWorkPageAnimations() {
  gsap.utils.toArray('.section-label__line').forEach(line => {
    gsap.to(line, {
      scaleX: 1,
      scrollTrigger: { trigger: line, start: 'top 85%' },
      duration: 1, ease: 'power2.out'
    });
  });

  // Gallery scroll animations disabled to prevent thumbnail flicker
  // Images load cleanly without scroll-triggered opacity changes
}
