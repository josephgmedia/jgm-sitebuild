/* ============================================================
   Joseph G Media — entry point (ES modules)
   Dependencies (loaded via CDN in HTML before this file):
   - Matter.js @0.20.0
   - Lenis     @1.0.42
   - GSAP      @3.12.5
   - ScrollTrigger @3.12.5
   ============================================================ */

import '../css/main.css';

import './greeting.js';
import './cursor.js';
import './nav.js';
import { initAnimations } from './init-animations.js';
import { initReelModal } from './reel-modal.js';
import { initContactForm } from './contact-form.js';
import './neon-cables.js';

window.addEventListener('load', () => {
  initAnimations();
  initReelModal();
  initContactForm();
});
