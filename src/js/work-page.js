/* ============================================================
   Work Page — entry point
   ============================================================ */

import '../css/main.css';
import '../css/work-page.css';
import '../css/lightbox.css';
import '../css/back-to-top.css';

import './cursor.js';
import './nav.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { renderGallery } from './gallery-renderer.js';
import { initGalleryFilter } from './gallery-filter.js';
import { initLightbox } from './lightbox.js';
import { initWorkPageAnimations } from './work-page-animations.js';
import { initContactForm } from './contact-form.js';
import { initBackToTop } from './back-to-top.js';

window.addEventListener('load', async () => {
  initSmoothScroll();
  await renderGallery();
  initGalleryFilter();
  initLightbox();
  initWorkPageAnimations();
  initContactForm();
  initBackToTop();
});
