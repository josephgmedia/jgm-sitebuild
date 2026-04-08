/* ============================================================
   Work Page — scroll-triggered entrance animations
   Per Emil Kowalski: stagger 50ms, translateY(8px), 300ms ease-out
   ============================================================ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initWorkPageAnimations() {
  // Hero title — no animation (seen every visit, frequency = high)
  // Per Emil: "No animation. Ever." for 100+ times/day elements

  // Section label line draws
  gsap.utils.toArray('.section-label__line').forEach(line => {
    gsap.to(line, {
      scaleX: 1,
      scrollTrigger: { trigger: line, start: 'top 85%' },
      duration: 1, ease: 'power2.out'
    });
  });

  // Gallery items — staggered batch entrance
  ScrollTrigger.batch('.gallery__item', {
    onEnter: batch => gsap.from(batch, {
      y: 8, opacity: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out'
    }),
    start: 'top 92%'
  });
}
