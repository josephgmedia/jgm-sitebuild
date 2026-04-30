/* ============================================================
   Showreel Modal — 3-state hero toggle with reel selector
   ============================================================ */

import { openVideoLightbox } from './lightbox.js';

// Showreel YouTube URLs
const SHOWREELS = {
  motion: 'https://youtu.be/IlWrnCIEMOk',
  '3d': 'https://youtu.be/Wh5ifcCAnUY',
  video: 'https://youtu.be/jKZBnYgfViw'
};

export function initReelModal() {
  const modal = document.getElementById('reel-modal');
  const reelToggle = document.getElementById('hero-reel');
  const closeBtn = document.getElementById('reel-close');
  const backBtn = document.getElementById('reel-close-btn');
  const overlay = modal?.querySelector('.reel-modal__overlay');
  const reelCards = modal?.querySelectorAll('.reel-card');

  if (!modal || !reelToggle) return;

  // Open modal when REEL toggle is selected
  reelToggle.addEventListener('change', () => {
    if (reelToggle.checked) {
      openModal();
    }
  });

  // Close modal handlers
  closeBtn?.addEventListener('click', closeModal);
  backBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Reel card clicks - open video in lightbox
  reelCards?.forEach(card => {
    card.addEventListener('click', () => {
      const reelType = card.dataset.reel;
      const videoUrl = SHOWREELS[reelType];

      console.log('Reel card clicked:', reelType, videoUrl);

      if (videoUrl) {
        closeModal();
        console.log('Opening lightbox with:', videoUrl);
        openVideoLightbox(videoUrl);
      } else {
        console.warn(`No video URL set for ${reelType} reel`);
      }
    });
  });

  function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    console.log('Closing reel modal');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Reset toggle to "ON" state when closing
    document.getElementById('hero-on').checked = true;
  }
}
