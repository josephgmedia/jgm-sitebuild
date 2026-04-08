/* ============================================================
   Gallery — category filter (works with dynamically rendered grid)
   ============================================================ */

export function initGalleryFilter() {
  const filters = document.querySelectorAll('.gallery__filter');
  const grid = document.getElementById('gallery-grid');

  if (!filters.length || !grid) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      // Update active state
      filters.forEach(f => {
        f.classList.remove('gallery__filter--active');
        f.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('gallery__filter--active');
      btn.setAttribute('aria-selected', 'true');

      // Query items fresh each time (they're dynamically rendered)
      const items = grid.querySelectorAll('.gallery__item');
      items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.classList.remove('gallery__item--hidden');
        } else {
          item.classList.add('gallery__item--hidden');
        }
      });
    });
  });
}
