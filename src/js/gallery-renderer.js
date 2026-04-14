/* ============================================================
   Gallery Renderer — builds grid from projects.json

   File naming convention:
   - Thumbnails: gallery-thumbs/{id}.jpg
   - Gallery images: gallery/{id}.jpg (single) or gallery/{id}-01.jpg, {id}-02.jpg (carousel)
   - Videos: paste YouTube/Vimeo URL into "videoUrl" field in JSON
   - Featured: set "featured": true and "href": "work/{slug}.html"
   ============================================================ */

import projectData from '../data/projects.json';

const THUMB_PATH = 'src/assets/images/gallery-thumbs/';
const FEATURED_THUMB_PATH = 'src/assets/images/featured-work/';

export function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // Sort featured items to the top so they render first as a group
  const sorted = [...projectData].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  sorted.forEach(project => {
    const item = document.createElement('div');
    item.className = 'gallery__item';
    item.setAttribute('role', 'listitem');
    item.dataset.category = project.category;
    item.dataset.type = project.type;
    item.dataset.id = project.id;

    // Featured items get special class
    if (project.featured) {
      item.classList.add('gallery__item--featured');
    }

    // Store media data for lightbox
    if (project.type === 'gallery') {
      item.dataset.media = JSON.stringify(project.media);
    } else if (project.type === 'video') {
      item.dataset.videoUrl = project.videoUrl || '';
    } else if (project.type === 'link') {
      item.dataset.href = project.href || '';
    }

    // Use featured-work path for featured items, gallery-thumbs for everything else
    const thumbFile = project.thumb || `${project.id}.jpg`;
    const thumbPath = project.featured ? FEATURED_THUMB_PATH : THUMB_PATH;

    item.innerHTML = `
      <div class="gallery__thumb" style="background-image: url('${thumbPath}${thumbFile}')"></div>
      <div class="gallery__caption">
        <h4 class="gallery__caption-title">${project.titleHtml || project.title}</h4>
        <span class="gallery__caption-role">${project.role}</span>
      </div>
    `;

    grid.appendChild(item);
  });
}

export { projectData };
