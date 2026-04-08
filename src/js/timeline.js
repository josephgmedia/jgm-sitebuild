import { CONFIG } from './config.js';

export function initTimeline() {
  // ── CAPABILITIES TIMELINE ──
  const tlSection     = document.getElementById('tl-section');
  const tlMonitor     = document.getElementById('tl-monitor');
  const tlBody        = document.getElementById('tl-body');
  const tlTrack       = document.getElementById('tl-track');
  const tlPlayhead    = document.getElementById('tl-playhead');
  const tlTimecode    = document.getElementById('tl-timecode');
  const tlMonitorName = document.getElementById('tl-monitor-name');
  const tlMonitorDesc = document.getElementById('tl-monitor-desc');
  const tlClips       = tlTrack ? Array.from(tlTrack.querySelectorAll('.timeline__clip')) : [];

  let drawerOpen      = false;
  let clipLeaveTimer  = null;
  let mouseOverClip   = false;
  let mouseOverMonitor = false;
  let scrubActive     = false;

  function getDrawerHeight() {
    return window.innerWidth < CONFIG.mobileBreakpoint
      ? Math.min(CONFIG.drawerHeightMobileMax, window.innerHeight * CONFIG.drawerHeightMobileVh) + 'px'
      : CONFIG.drawerHeightDesktop + 'px';
  }

  function openDrawer() {
    if (!tlMonitor || drawerOpen) return;
    tlMonitor.style.height = getDrawerHeight();
    tlMonitor.classList.add('is-open');
    drawerOpen = true;
  }

  function closeDrawer() {
    if (!tlMonitor || !drawerOpen) return;
    // On mobile, keep monitor permanently open
    if (window.innerWidth < CONFIG.tabletBreakpoint) return;
    tlMonitor.style.height = '0';
    tlMonitor.classList.remove('is-open');
    drawerOpen = false;
  }

  // Monitor stays open while cursor is over a clip OR inside the monitor
  tlClips.forEach(cl => {
    cl.addEventListener('mouseenter', () => { mouseOverClip = true; });
    cl.addEventListener('mouseleave', () => { mouseOverClip = false; });
  });
  if (tlMonitor) {
    tlMonitor.addEventListener('mouseenter', () => { mouseOverMonitor = true; });
    tlMonitor.addEventListener('mouseleave', () => { mouseOverMonitor = false; });
  }

  // Playhead only scrubs when mouse is over the ruler/track/clips
  const tlRuler = tlBody?.querySelector('.timeline__ruler');
  [tlRuler, tlTrack].forEach(el => {
    if (!el) return;
    el.addEventListener('mouseenter', () => { scrubActive = true; });
    el.addEventListener('mouseleave', () => { scrubActive = false; });
  });

  function crossfadeContent(idx) {
    const els = [tlMonitorName, tlMonitorDesc].filter(Boolean);
    els.forEach(el => { el.style.transition = 'opacity 0.15s ease'; el.style.opacity = '0'; });
    setTimeout(() => {
      // crossfade delay
      if (tlMonitorName) tlMonitorName.textContent = TL_DATA[idx].name;
      if (tlMonitorDesc) tlMonitorDesc.textContent = TL_DATA[idx].desc;
      els.forEach(el => { el.style.transition = 'opacity 0.25s ease'; el.style.opacity = '1'; });
    }, CONFIG.crossfadeDelay);
  }

  tlSection?.addEventListener('mouseleave', () => {
    if (clipLeaveTimer) { clearTimeout(clipLeaveTimer); clipLeaveTimer = null; }
    mouseOverClip = false;
    mouseOverMonitor = false;
    scrubActive = false;
    closeDrawer();
  });

  // Media element map — each discipline maps to its DOM element ID
  const MEDIA_MAP = {
    'Motion Design & 2D Animation':     'tl-media-motion2d',
    '3D Animation':                     'tl-media-3d',
    'Photography':                      'tl-media-photo',
    'Videography':                      'tl-media-videography',
    'Video Editing & Colour Grading':   'tl-media-editing',
    'Design & Illustration':            'tl-media-design',
    'Music Composition & Sound Design': 'tl-media-audio',
    'Web Design':                       'tl-media-web',
    'AI & Generative Design':           'tl-media-genai',
  };

  let currentMediaId = null;
  let photoInterval = null;
  let photoIndex = 0;

  // Photography slideshow
  const photoSlides = document.querySelectorAll('#tl-media-photo .timeline__photo-slide');
  function startPhotoSlideshow() {
    if (photoInterval) return;
    photoIndex = 0;
    photoSlides.forEach((s, i) => s.classList.toggle('is-active', i === 0));
    photoInterval = setInterval(() => {
      photoSlides[photoIndex].classList.remove('is-active');
      photoIndex = (photoIndex + 1) % photoSlides.length;
      photoSlides[photoIndex].classList.add('is-active');
    }, CONFIG.slideshowInterval);
  }
  function stopPhotoSlideshow() {
    if (photoInterval) { clearInterval(photoInterval); photoInterval = null; }
  }

  // Show first discipline by default
  const firstMedia = document.getElementById('tl-media-motion2d');
  if (firstMedia) {
    firstMedia.classList.add('is-active');
    if (firstMedia.tagName === 'VIDEO') { firstMedia.play().catch(() => {}); }
    currentMediaId = 'tl-media-motion2d';
  }

  function switchMonitorMedia(name) {
    const newId = MEDIA_MAP[name];
    if (!newId || newId === currentMediaId) return;

    // Deactivate current
    if (currentMediaId) {
      const oldEl = document.getElementById(currentMediaId);
      if (oldEl) {
        oldEl.classList.remove('is-active');
        if (oldEl.tagName === 'VIDEO') { oldEl.pause(); oldEl.currentTime = 0; }
      }
      if (currentMediaId === 'tl-media-photo') stopPhotoSlideshow();
    }

    // Activate new
    const newEl = document.getElementById(newId);
    if (newEl) {
      newEl.classList.add('is-active');
      if (newEl.tagName === 'VIDEO') { newEl.currentTime = 0; newEl.play().catch(() => {}); }
      if (newId === 'tl-media-photo') startPhotoSlideshow();
    }

    currentMediaId = newId;
  }

  const TL_DATA = [
    { name: 'Motion Design & 2D Animation',     desc: 'After Effects, character rigging, expressions, Duik, Limber',                       link: 'work.html#motion-design' },
    { name: '3D Animation',                     desc: 'Cinema 4D, Redshift rendering, Unreal Engine',                                     link: 'work.html#3d-animation' },
    { name: 'Photography',                      desc: 'Commercial, portrait, event, product and press photography',                       link: 'work.html#photography' },
    { name: 'Videography',                      desc: 'Direction, capture, multi-format production',                                      link: 'work.html#videography' },
    { name: 'Video Editing & Colour Grading',   desc: 'Premiere Pro, DaVinci Resolve, multi-cam, long and short form',                    link: 'work.html#video-editing' },
    { name: 'Design & Illustration',            desc: 'Brand, print, OOH, social, merch, album art, promotional',                        link: 'work.html#design-illustration' },
    { name: 'Music Composition & Sound Design', desc: 'Ableton, Logic, Pro Tools - composition, scoring and sound design',           link: 'work.html#music-composition' },
    { name: 'Web Design',                       desc: 'Custom builds in HTML, CSS, JavaScript, WordPress and Squarespace',                link: 'work.html#web-design' },
    { name: 'AI & Generative Design',           desc: 'Stable Diffusion, ComfyUI - workflow development',               link: 'work.html#ai-generative-design' },
  ];

  // Make each clip clickable
  tlClips.forEach((cl, i) => {
    cl.style.cursor = 'pointer';
    cl.addEventListener('click', () => {
      // Desktop: click navigates to work page. Mobile handled separately.
      if (window.innerWidth >= CONFIG.tabletBreakpoint) {
        if (TL_DATA[i]?.link) window.location.href = TL_DATA[i].link;
      }
    });
    // Keyboard: Enter to navigate, focus to show monitor
    cl.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        if (TL_DATA[i]?.link) window.location.href = TL_DATA[i].link;
      }
    });
    cl.addEventListener('focus', () => {
      tlClips.forEach(c => c.classList.remove('is-active'));
      cl.classList.add('is-active');
      crossfadeContent(i);
      switchMonitorMedia(TL_DATA[i].name);
      openDrawer();
    });
  });

  if (tlBody && tlPlayhead && tlClips.length) {
    const TOTAL_FRAMES = CONFIG.totalFrames;
    let mouseClientX = window.innerWidth * 0.5;
    let targetX  = 0;
    let currentX = 0;
    let monitorIdx = 0;

    // Default monitor to first clip
    if (tlMonitorName) tlMonitorName.textContent = TL_DATA[0].name;
    if (tlMonitorDesc) tlMonitorDesc.textContent = TL_DATA[0].desc;
    tlClips[0].classList.add('is-active');

    let bodyRect  = tlBody.getBoundingClientRect();
    let clipRects = [];

    function cacheRects() {
      bodyRect  = tlBody.getBoundingClientRect();
      clipRects = tlClips.map(cl => {
        const r = cl.getBoundingClientRect();
        return { left: r.left - bodyRect.left, right: r.right - bodyRect.left };
      });
    }
    cacheRects();
    window.addEventListener('resize', cacheRects);

    tlSection?.addEventListener('mousemove', e => {
      mouseClientX = e.clientX;
    }, { passive: true });

    const isMobileTimeline = window.innerWidth < CONFIG.tabletBreakpoint;
    const scrollProgressFill = document.getElementById('tl-scroll-progress-fill');

    if (!isMobileTimeline) {
      // Desktop: touch events for mouse-like scrub (tablets with mouse)
      tlSection?.addEventListener('touchstart', e => {
        scrubActive = true;
        mouseOverClip = true;
        mouseClientX = e.touches[0].clientX;
        cacheRects();
      }, { passive: true });
      tlSection?.addEventListener('touchmove', e => {
        mouseClientX = e.touches[0].clientX;
      }, { passive: true });
      tlSection?.addEventListener('touchend', () => {
        scrubActive = false;
        mouseOverClip = false;
      });
    }

    if (isMobileTimeline && tlTrack) {
      // Mobile: clip scroll + smooth playhead via GSAP

      // Position playhead over a clip (call only when clip is in final position)
      function positionPlayhead(idx) {
        const clipEl = tlClips[idx];
        if (!clipEl) return;
        const bodyLeft = tlBody.getBoundingClientRect().left;
        const clipRect = clipEl.getBoundingClientRect();
        const cx = (clipRect.left + clipRect.width / 2) - bodyLeft;
        tlPlayhead.style.transform = `translateX(${cx}px)`;
        currentX = cx;
        const frac = bodyRect.width > 0 ? currentX / bodyRect.width : 0;
        tlTimecode.textContent = toTimecode(Math.round(frac * TOTAL_FRAMES));
      }

      // Select a clip — update active state and monitor
      function selectClipMobile(idx) {
        tlClips.forEach(cl => cl.classList.remove('is-active'));
        tlClips[idx]?.classList.add('is-active');
        openDrawer();
        if (idx !== monitorIdx) {
          monitorIdx = idx;
          crossfadeContent(idx);
          switchMonitorMedia(TL_DATA[idx].name);
        }
      }

      // Scroll progress bar
      tlTrack.addEventListener('scroll', () => {
        const maxScroll = tlTrack.scrollWidth - tlTrack.clientWidth;
        if (maxScroll <= 0) return;
        const pct = tlTrack.scrollLeft / maxScroll;
        if (scrollProgressFill) scrollProgressFill.style.width = (pct * 100) + '%';
      }, { passive: true });

      // Detect centred clip after scroll settles
      let lastScrollLeft = -1;
      let pollTimer = null;

      function onScrollSettled() {
        const trackRect = tlTrack.getBoundingClientRect();
        const trackCentre = trackRect.left + trackRect.width / 2;
        let closestIdx = 0;
        let closestDist = Infinity;
        tlClips.forEach((cl, i) => {
          const r = cl.getBoundingClientRect();
          const dist = Math.abs((r.left + r.width / 2) - trackCentre);
          if (dist < closestDist) { closestDist = dist; closestIdx = i; }
        });
        selectClipMobile(closestIdx);
        positionPlayhead(closestIdx);
      }

      if ('onscrollend' in window) {
        tlTrack.addEventListener('scrollend', onScrollSettled);
      } else {
        tlTrack.addEventListener('scroll', () => {
          clearInterval(pollTimer);
          pollTimer = setInterval(() => {
            if (tlTrack.scrollLeft === lastScrollLeft) {
              clearInterval(pollTimer);
              onScrollSettled();
            }
            lastScrollLeft = tlTrack.scrollLeft;
          }, CONFIG.scrollPollInterval);
        }, { passive: true });
      }

      // Tap a clip to select it — ignore swipe gestures
      let touchStartX = 0;
      let touchEndX = 0;
      let wasSwiping = false;
      tlTrack.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        wasSwiping = false;
      }, { passive: true });
      tlTrack.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].clientX;
        wasSwiping = Math.abs(touchEndX - touchStartX) > CONFIG.swipeThreshold;
      }, { passive: true });
      tlClips.forEach((cl, i) => {
        cl.addEventListener('click', () => {
          if (wasSwiping) return;
          selectClipMobile(i);
          cl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          setTimeout(() => positionPlayhead(i), CONFIG.tapPositionDelay);
        });
      });

      // Open monitor by default with first clip
      selectClipMobile(0);
      positionPlayhead(0);
    }

    function pad(n) { return String(n).padStart(2, '0'); }
    function toTimecode(f) {
      const fps = CONFIG.timecodeFramerate;
      const ff = f % fps;
      const ss = Math.floor(f / fps) % 60;
      const mm = Math.floor(f / (fps * 60)) % 60;
      const hh = Math.floor(f / (fps * 3600));
      return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
    }

    (function tlTick() {
      // On mobile, GSAP drives the playhead — skip manual positioning
      if (!isMobileTimeline) {
        if (scrubActive) {
          targetX  = Math.max(0, Math.min(bodyRect.width, mouseClientX - bodyRect.left));
        }
        currentX += (targetX - currentX) * CONFIG.playheadLerp;

        tlPlayhead.style.transform = `translateX(${currentX}px)`;

        const frac = bodyRect.width > 0 ? currentX / bodyRect.width : 0;
        tlTimecode.textContent = toTimecode(Math.round(frac * TOTAL_FRAMES));
      }

      // On mobile, clip active state is managed by selectClipMobile — skip tick logic
      let hitIdx = -1;
      if (!isMobileTimeline) {
        tlClips.forEach((cl, i) => {
          const b   = clipRects[i];
          const hit = b && currentX >= b.left && currentX <= b.right;
          cl.classList.toggle('is-active', !!hit);
          const monitorHit = b && targetX >= b.left - 4 && targetX <= b.right + 4;
          if (monitorHit) hitIdx = i;
        });
      }

      const keepOpen = mouseOverClip || mouseOverMonitor;

      if (keepOpen && hitIdx >= 0) {
        if (clipLeaveTimer) { clearTimeout(clipLeaveTimer); clipLeaveTimer = null; }
        openDrawer();
        if (hitIdx !== monitorIdx) {
          monitorIdx = hitIdx;
          crossfadeContent(hitIdx);
          switchMonitorMedia(TL_DATA[hitIdx].name);
        }
      } else if (keepOpen && drawerOpen) {
        // Mouse is in monitor but not on a clip — keep drawer open, don't change content
        if (clipLeaveTimer) { clearTimeout(clipLeaveTimer); clipLeaveTimer = null; }
      } else if (drawerOpen && !clipLeaveTimer) {
        clipLeaveTimer = setTimeout(() => { closeDrawer(); clipLeaveTimer = null; }, CONFIG.clipCloseDelay);
      }

      requestAnimationFrame(tlTick);
    })();
  }
}
