export function initWorkTap() {
  // ── FEATURED WORK GRID — tap to reveal on mobile ──
  if ('ontouchstart' in window) {
    document.querySelectorAll('.work__grid .work__card').forEach(card => {
      card.addEventListener('click', () => {
        const wasActive = card.classList.contains('is-tapped');
        document.querySelectorAll('.work__grid .work__card.is-tapped').forEach(c => c.classList.remove('is-tapped'));
        if (!wasActive) card.classList.add('is-tapped');
      });
    });
  }
}
