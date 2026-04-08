/* ============================================================
   Case Study — inline expand/collapse accordion
   ============================================================ */

export function initCaseStudyExpand() {
  const items = document.querySelectorAll('.featured__item');

  items.forEach(item => {
    const card = item.querySelector('.featured__card');
    const drawer = item.querySelector('.featured__drawer');
    if (!card || !drawer) return;

    card.addEventListener('click', () => {
      const isOpen = item.classList.contains('featured__item--open');

      // Close all other open drawers (accordion — one at a time)
      items.forEach(other => {
        if (other !== item && other.classList.contains('featured__item--open')) {
          other.classList.remove('featured__item--open');
          const otherDrawer = other.querySelector('.featured__drawer');
          if (otherDrawer) otherDrawer.style.maxHeight = '0';
          const otherCard = other.querySelector('.featured__card');
          if (otherCard) otherCard.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('featured__item--open');
        drawer.style.maxHeight = '0';
        card.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('featured__item--open');
        drawer.style.maxHeight = drawer.scrollHeight + 'px';
        card.setAttribute('aria-expanded', 'true');

        // Scroll into view after animation starts
        setTimeout(() => {
          item.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });

    // Keyboard accessibility
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}
