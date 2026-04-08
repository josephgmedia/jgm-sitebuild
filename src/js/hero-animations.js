import { CONFIG } from './config.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHeroAnimations() {
  // ── HERO ENTRANCE ──
  gsap.to('#hero-foot', { opacity: 1, y: 0, duration: CONFIG.heroFootDuration, delay: CONFIG.heroFootDelay, ease: 'power4.out' });

  // ── HERO FOOT — fade, blur & collapse on scroll ──
  const heroFoot = document.getElementById('hero-foot');
  if (heroFoot) {
    ScrollTrigger.create({
      trigger: '.hero',
      start: '2px top',
      end: '+=' + CONFIG.heroFootScrollEnd,
      scrub: CONFIG.heroFootScrub,
      animation: gsap.fromTo(heroFoot,
        { opacity: 1, filter: 'blur(0px)', height: heroFoot.offsetHeight, paddingTop: 22, paddingBottom: 22 },
        { opacity: 0, filter: 'blur(12px)', height: 0, paddingTop: 0, paddingBottom: 0, ease: 'none' }
      ),
    });
  }
}
