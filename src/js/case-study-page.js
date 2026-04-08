/* ============================================================
   Case Study Page — entry point
   ============================================================ */

import '../css/main.css';
import '../css/case-study.css';

import './cursor.js';
import './nav.js';
import { initSmoothScroll } from './smooth-scroll.js';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
  initSmoothScroll();

  // Hero image subtle parallax
  gsap.to('.cs-hero__img', {
    backgroundPositionY: '30%',
    scrollTrigger: {
      trigger: '.cs-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
    }
  });

  // Gallery images fade in on scroll
  ScrollTrigger.batch('.cs-gallery__item', {
    onEnter: batch => gsap.from(batch, {
      y: 8, opacity: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out'
    }),
    start: 'top 92%'
  });
});
