import { CONFIG } from './config.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHeroAnimations() {
  // ── SCROLL INDICATOR ENTRANCE ──
  const scrollIndicator = document.getElementById('hero-scroll-indicator');
  console.log('Scroll indicator element:', scrollIndicator);
  if (scrollIndicator) {
    console.log('Starting scroll indicator animation');
    // Animate in
    gsap.to(scrollIndicator, {
      opacity: 1,
      y: 0,
      duration: CONFIG.heroFootDuration,
      delay: CONFIG.heroFootDelay,
      ease: 'power4.out',
      onComplete: () => {
        // Add floating animation after entrance
        gsap.to(scrollIndicator, {
          y: -10,
          duration: 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      }
    });

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
