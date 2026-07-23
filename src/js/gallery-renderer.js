/* ============================================================
   Gallery Renderer — builds grid from /api/projects (Blob + static)

   File naming convention for static items:
   - Thumbnails: gallery-thumbs/{id}.jpg
   - Featured thumbs: featured-work/{id}.jpg
   - Gallery images: gallery/{id}.jpg or gallery/{id}-01.jpg
   - Dynamic items use absolute Blob URLs for all images.
   ============================================================ */

const THUMB_PATH = 'src/assets/images/gallery-thumbs/';
const FEATURED_THUMB_PATH = 'src/assets/images/featured-work/';

function isAbsoluteUrl(str) {
  return typeof str === 'string' && (str.startsWith('http') || str.startsWith('//'));
}

export async function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  let projectData;
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('API not available');
    projectData = await res.json();
  } catch {
    // Local dev fallback — import static JSON directly
    const { default: staticData } = await import('../data/projects.json');
    projectData = staticData;
  }

  // Sort featured items to the top
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

    if (project.featured) {
      item.classList.add('gallery__item--featured');
    }

    let hasMixedMedia = false;
    if (project.type === 'gallery') {
      item.dataset.media = JSON.stringify(project.media);
      const hasVideo = project.media.some(m => m.type === 'video');
      const hasImage = project.media.some(m => m.type === 'image' || !m.type);
      hasMixedMedia = hasVideo && hasImage;
    } else if (project.type === 'video') {
      const videoUrls = project.videoUrl || project.videoUrls || '';
      item.dataset.videoUrl = Array.isArray(videoUrls) ? JSON.stringify(videoUrls) : videoUrls;
    } else if (project.type === 'link') {
      item.dataset.href = project.href || '';
    }

    const thumbFile = project.thumb || `${project.id}.jpg`;
    // Blob-stored items use absolute URLs; static items use relative paths
    const thumbSrc = isAbsoluteUrl(thumbFile)
      ? thumbFile
      : (project.featured ? FEATURED_THUMB_PATH : THUMB_PATH) + thumbFile;

    const mixedBadge = hasMixedMedia
      ? '<span class="gallery__mixed-badge" data-badge="mixed">PHOTO/VIDEO</span>'
      : '';

    item.innerHTML = `
      <div class="gallery__thumb">
        <img src="${thumbSrc}" alt="${project.title}" loading="lazy" decoding="async">
        ${mixedBadge}
      </div>
      <div class="gallery__caption">
        <h4 class="gallery__caption-title">${project.titleHtml || project.title}</h4>
        <span class="gallery__caption-role">${project.role}</span>
      </div>
    `;

    grid.appendChild(item);

    const img = item.querySelector('img');
    const thumb = item.querySelector('.gallery__thumb');
    if (img && thumb) {
      const onLoad = () => {
        img.classList.add('loaded');
        thumb.classList.add('loaded');
      };
      if (img.complete && img.naturalHeight !== 0) {
        onLoad();
      } else {
        img.addEventListener('load', onLoad);
      }
    }
  });
}
