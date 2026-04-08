/* ============================================================
   Work Page — entry point
   ============================================================ */

import '../css/main.css';
import '../css/work-page.css';
import '../css/lightbox.css';

import './cursor.js';
import './nav.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { renderGallery } from './gallery-renderer.js';
import { initGalleryFilter } from './gallery-filter.js';
import { initLightbox } from './lightbox.js';
import { initWorkPageAnimations } from './work-page-animations.js';

window.addEventListener('load', () => {
  initSmoothScroll();
  renderGallery();
  initGalleryFilter();
  initLightbox();
  initWorkPageAnimations();
});
