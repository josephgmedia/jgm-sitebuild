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
        const categories = item.dataset.category.split(',').map(c => c.trim());
        if (category === 'all' || categories.includes(category)) {
          item.classList.remove('gallery__item--hidden');
        } else {
          item.classList.add('gallery__item--hidden');
        }
      });

      // Show/hide mixed media badges based on filter
      const badges = grid.querySelectorAll('.gallery__mixed-badge');
      badges.forEach(badge => {
        // Only show badges on "All" view
        if (category === 'all') {
          badge.style.display = '';
        } else {
          badge.style.display = 'none';
        }
      });
    });
  });
}
