/* ============================================================
   Showreel Modal — 3-state hero toggle with reel selector
   ============================================================ */

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
  overlay?.addEventListener('click', closeModal);

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Reel card clicks - open video player (lightbox or new window)
  reelCards?.forEach(card => {
    card.addEventListener('click', () => {
      const reelType = card.dataset.reel;
      const videoUrl = SHOWREELS[reelType];

      if (videoUrl) {
        // Open YouTube video in new tab
        window.open(videoUrl, '_blank');
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
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Reset toggle to "ON" state when closing
    document.getElementById('hero-on').checked = true;
  }
}
