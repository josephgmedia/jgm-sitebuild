/* ============================================================
   BACK TO TOP — shows when scrolled down, smooth scroll up
   ============================================================ */

export function initBackToTop() {
  // Create button
  const button = document.createElement('button');
  button.className = 'back-to-top';
  button.setAttribute('aria-label', 'Back to top');
  button.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  document.body.appendChild(button);

  // Show/hide based on scroll position
  let ticking = false;
  function updateVisibility() {
    const scrollThreshold = 500; // Show after scrolling 500px
    if (window.scrollY > scrollThreshold) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateVisibility);
      ticking = true;
    }
  }, { passive: true });

  // Scroll to top on click
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
