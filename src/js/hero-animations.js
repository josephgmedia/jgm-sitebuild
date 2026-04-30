import { CONFIG } from './config.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHeroAnimations() {
  // ── SCROLL INDICATOR ENTRANCE ──
  const scrollIndicator = document.getElementById('hero-scroll-indicator');
  if (scrollIndicator) {
    const circlePath = scrollIndicator.querySelector('.scroll-circle__path');
    const arrow = scrollIndicator.querySelector('.scroll-arrow');

    // Timeline for scroll indicator animation
    const tl = gsap.timeline({ delay: 1.5 });

    // 1. Fade in container and draw circle
    tl.to(scrollIndicator, {
      opacity: 1,
      duration: 0.3
    })
    .to(circlePath, {
      strokeDashoffset: 0,
      duration: 1,
      ease: 'power2.out'
    }, '<')
    // 2. Arrow drops down from above and fades in
    .fromTo(arrow, {
      y: -20,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.2')
    // 3. Start floating animation
    .to(scrollIndicator, {
      y: -10,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    }, '+=0.5');

    // ── SCROLL INDICATOR — fade & blur on scroll ──
    ScrollTrigger.create({
      trigger: '.hero',
      start: '2px top',
      end: '+=' + CONFIG.heroFootScrollEnd,
      scrub: CONFIG.heroFootScrub,
      animation: gsap.fromTo(scrollIndicator,
        { opacity: 1, filter: 'blur(0px)' },
        { opacity: 0, filter: 'blur(12px)', ease: 'none' }
      ),
    });
  }
}
