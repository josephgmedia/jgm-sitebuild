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
  const viewWorkBtn = document.getElementById('hero-view-work');
  const backBtn = document.getElementById('reel-close-btn');
  const overlay = modal?.querySelector('.reel-modal__overlay');
  const reelCards = modal?.querySelectorAll('.reel-card');

  if (!modal || !viewWorkBtn) return;

  // Open modal when View Work button is clicked
  viewWorkBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  // Close modal handlers
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

      if (videoUrl) {
        closeModal();
        openVideoLightbox(videoUrl);
      }
    });
  });

  function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    // Blur focused element to prevent aria-hidden focus warning
    if (document.activeElement && modal.contains(document.activeElement)) {
      document.activeElement.blur();
    }

    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
