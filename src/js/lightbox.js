/* ============================================================
   Lightbox — image gallery + video embed viewer
   ============================================================ */

const GALLERY_PATH = 'src/assets/images/gallery/';

let overlay = null;
let mediaContainer = null;
let closeBtn = null;
let prevBtn = null;
let nextBtn = null;
let counter = null;
let currentMedia = [];
let currentIndex = 0;

function createLightbox() {
  overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Media viewer');
  overlay.setAttribute('aria-hidden', 'true');

  overlay.innerHTML = `
    <button class="lightbox__close" aria-label="Close">&times;</button>
    <button class="lightbox__prev" aria-label="Previous">&lsaquo;</button>
    <button class="lightbox__next" aria-label="Next">&rsaquo;</button>
    <div class="lightbox__media"></div>
    <div class="lightbox__counter"></div>
  `;

  document.body.appendChild(overlay);

  closeBtn = overlay.querySelector('.lightbox__close');
  prevBtn = overlay.querySelector('.lightbox__prev');
  nextBtn = overlay.querySelector('.lightbox__next');
  mediaContainer = overlay.querySelector('.lightbox__media');
  counter = overlay.querySelector('.lightbox__counter');

  // Close handlers
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', e => {
    if (!overlay || overlay.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Nav handlers
  prevBtn.addEventListener('click', e => { e.stopPropagation(); prev(); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); next(); });

  // Touch swipe
  let touchStartX = 0;
  mediaContainer.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  mediaContainer.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx > 0 ? prev() : next();
    }
  });
}

function openGallery(media, startIndex = 0) {
  if (!overlay) createLightbox();
  currentMedia = media;
  currentIndex = startIndex;
  showCurrent();
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('lightbox--open');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function openVideo(videoUrl) {
  if (!overlay) createLightbox();

  // Support array of video URLs for carousel
  const videoUrls = Array.isArray(videoUrl) ? videoUrl : [videoUrl];

  // Convert to media format for carousel
  currentMedia = videoUrls.map(url => ({ type: 'video', url }));
  currentIndex = 0;

  showCurrentVideo();

  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('lightbox--open');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}

function showCurrentVideo() {
  const item = currentMedia[currentIndex];

  if (item && item.url) {
    // Convert YouTube URLs to embed format
    let embedUrl = item.url;
    const youtubeMatch = item.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    mediaContainer.innerHTML = `
      <iframe class="lightbox__iframe" src="${embedUrl}"
        frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
    `;
  } else {
    mediaContainer.innerHTML = `
      <div class="lightbox__placeholder">
        <p>Video coming soon</p>
      </div>
    `;
  }

  // Show/hide nav based on video count
  const isMulti = currentMedia.length > 1;
  prevBtn.style.display = isMulti ? '' : 'none';
  nextBtn.style.display = isMulti ? '' : 'none';
  counter.textContent = isMulti ? `${currentIndex + 1} / ${currentMedia.length}` : '';
}

function showCurrent() {
  const item = currentMedia[currentIndex];

  // Handle video type in carousel
  if (item.type === 'video') {
    showCurrentVideo();
    return;
  }

  // Handle image
  mediaContainer.innerHTML = `
    <img class="lightbox__img" src="${GALLERY_PATH}${item.src}" alt="${item.alt || ''}" />
  `;

  // Show/hide nav based on gallery size
  const isMulti = currentMedia.length > 1;
  prevBtn.style.display = isMulti ? '' : 'none';
  nextBtn.style.display = isMulti ? '' : 'none';
  counter.textContent = isMulti ? `${currentIndex + 1} / ${currentMedia.length}` : '';
}

function prev() {
  if (currentMedia.length <= 1) return;
  currentIndex = (currentIndex - 1 + currentMedia.length) % currentMedia.length;
  showCurrent();
}

function next() {
  if (currentMedia.length <= 1) return;
  currentIndex = (currentIndex + 1) % currentMedia.length;
  showCurrent();
}

function close() {
  if (!overlay) return;
  overlay.classList.remove('lightbox--open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Clear iframe to stop video playback
  mediaContainer.innerHTML = '';
}

export function initLightbox() {
  // Delegate click on gallery items
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.addEventListener('click', e => {
    const item = e.target.closest('.gallery__item');
    if (!item) return;

    const type = item.dataset.type;

    if (type === 'link') {
      // Featured project — navigate to case study page
      const href = item.dataset.href;
      if (href) window.location.href = href;
      return;
    }

    if (type === 'video') {
      let videoUrl = item.dataset.videoUrl;
      // Parse if it's a JSON array
      try {
        const parsed = JSON.parse(videoUrl);
        if (Array.isArray(parsed)) {
          videoUrl = parsed;
        }
      } catch (e) {
        // Not JSON, use as-is
      }
      openVideo(videoUrl);
      return;
    }

    if (type === 'gallery') {
      try {
        const media = JSON.parse(item.dataset.media);
        openGallery(media);
      } catch (err) {
        // Fallback — just show the thumbnail
        openGallery([{ src: item.querySelector('.gallery__thumb')?.style.backgroundImage?.match(/url\(['"]?(.+?)['"]?\)/)?.[1] || '', alt: '' }]);
      }
    }
  });
}
