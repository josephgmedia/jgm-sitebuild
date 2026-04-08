/* ============================================================
   INIT ANIMATIONS — called after page load
   Dependencies (window globals via CDN):
   - Lenis, gsap, ScrollTrigger
   ============================================================ */

import { initSmoothScroll } from './smooth-scroll.js';
import { initHeroAnimations } from './hero-animations.js';
import { initTimeline } from './timeline.js';
import { initSlideText } from './slide-text.js';
import { initWorkTap } from './work-tap.js';
import { initWordSweep } from './word-sweep.js';
import { initStats } from './stats.js';
import { initContactAnim } from './contact-anim.js';

export function initAnimations() {
  initSmoothScroll();
  initHeroAnimations();
  initTimeline();
  initSlideText();
  initWorkTap();
  initWordSweep();
  initStats();
  initContactAnim();
}
