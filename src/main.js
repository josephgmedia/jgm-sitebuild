/* ============================================================
   Joseph G Media — main.js
   Dependencies (loaded via CDN in HTML before this file):
   - Matter.js @0.20.0
   - Lenis     @1.0.42
   - GSAP      @3.12.5
   - ScrollTrigger @3.12.5
   ============================================================ */

// ── CONFIG ──
const CONFIG = {
  // Breakpoints
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,

  // Cursor
  cursorLerp: 0.12,

  // Smooth scroll
  scrollLerp: 0.08,
  navScrollThreshold: 60,

  // Timeline
  totalFrames: 750,
  playheadLerp: 0.08,
  timecodeFramerate: 25,
  clipCloseDelay: 800,
  scrollPollInterval: 50,
  swipeThreshold: 10,
  tapPositionDelay: 350,

  // Monitor drawer
  drawerHeightDesktop: 280,
  drawerHeightMobileMax: 200,
  drawerHeightMobileVh: 0.4,
  crossfadeDelay: 150,

  // Photo slideshow
  slideshowInterval: 3000,

  // Hero entrance
  heroFootDuration: 0.6,
  heroFootDelay: 0.4,
  heroFootScrollEnd: 200,
  heroFootScrub: 0.6,

  // Word reveal
  wordRevealDuration: 1,
  wordRevealStagger: 0.16,

  // Slide text drum
  drumWordDuration: 2.5,
  drumMaxAngle: 91,

  // Word sweep (about paragraphs)
  wordSweepStagger: 0.04,
  wordSweepScrub: 0.5,

  // Stats
  statsStagger: 0.1,
  statFlipDelay: 1,

  // Contact
  contactRevealDuration: 0.9,

  // Cable physics
  cableRefW: 2560,
  cableRefH: 1440,
  cableSignW: 1788,
  cableSignH: 634,
  cableWireThickness: 13,
  cableMouseRadius: 25,
  cableSegRadius: 14,
  cableFrictionAir: 0.1,
  cableStiffness: 0.5,
  cableDamping: 0.08,
  cableMinSegs: 8,
  cableSegDivisor: 12,
  cableOffStateSag: 15,
  cableOffStateSegs: 10,
  cableZoneBreak: 0.45,
  cableSplineSteps: 6,
  cableGlowWidthMul: 2.8,
  cableGlowAlpha: 0.15,
  cableHighlightWidthMul: 0.18,
  cableHighlightAlphaOn: 0.5,
  cableHighlightAlphaOff: 0.25,
  cableShadowBlur: 8,
  cableShadowOffsetX: 2,
  cableShadowOffsetY: 4,

  // Orientation change
  orientationDelay: 100,

  // Debug
  debugDotRadius: 10,
  debugHitRadius: 20,
};

// ── GREETING ──
(function () {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const el = document.getElementById('greeting');
  if (el) el.textContent = g + '.';
})();

window.addEventListener('load', () => {
  initAnimations();
});

// ── CURSOR ──
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
}, { passive: true });

(function cursorLoop() {
  rx += (mx - rx) * CONFIG.cursorLerp;
  ry += (my - ry) * CONFIG.cursorLerp;
  if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
  requestAnimationFrame(cursorLoop);
})();

document.querySelectorAll('a, .work-card, .tl-clip, .stat, .marquee-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring?.classList.add('big');
    dot?.classList.add('hot');
  });
  el.addEventListener('mouseleave', () => {
    ring?.classList.remove('big');
    dot?.classList.remove('hot');
  });
});

// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', scrollY > CONFIG.navScrollThreshold);
}, { passive: true });

// ── MOBILE NAV ──
const hamburger = document.getElementById('nav-hamburger');
const navClose = document.getElementById('nav-close');
const navOverlay = document.getElementById('nav-overlay');
if (hamburger && navOverlay) {
  function openNav() {
    document.body.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
    navOverlay.setAttribute('aria-hidden', 'false');
    navClose?.focus();
  }
  function closeNav() {
    document.body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    navOverlay.setAttribute('aria-hidden', 'true');
    hamburger.focus();
  }
  hamburger.addEventListener('click', openNav);
  navClose?.addEventListener('click', closeNav);
  navOverlay.querySelectorAll('.nav-overlay-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });
  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) closeNav();
  });
}

// ── MAIN ANIMATIONS (called after loader exits) ──
function initAnimations() {

  // Lenis smooth scroll
  const lenis = new Lenis({ lerp: CONFIG.scrollLerp, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ── HERO ENTRANCE ──
  gsap.to('#hero-foot', { opacity: 1, y: 0, duration: CONFIG.heroFootDuration, delay: CONFIG.heroFootDelay, ease: 'power4.out' });

  // ── HERO FOOT — fade, blur & collapse on scroll ──
  const heroFoot = document.getElementById('hero-foot');
  if (heroFoot) {
    ScrollTrigger.create({
      trigger: '.hero-neon',
      start: '2px top',
      end: '+=' + CONFIG.heroFootScrollEnd,
      scrub: CONFIG.heroFootScrub,
      animation: gsap.fromTo(heroFoot,
        { opacity: 1, filter: 'blur(0px)', height: heroFoot.offsetHeight, paddingTop: 22, paddingBottom: 22 },
        { opacity: 0, filter: 'blur(12px)', height: 0, paddingTop: 0, paddingBottom: 0, ease: 'none' }
      ),
    });
  }

  // ── CAPABILITIES TIMELINE ──
  const tlSection     = document.getElementById('tl-section');
  const tlMonitor     = document.getElementById('tl-monitor');
  const tlBody        = document.getElementById('tl-body');
  const tlTrack       = document.getElementById('tl-track');
  const tlPlayhead    = document.getElementById('tl-playhead');
  const tlTimecode    = document.getElementById('tl-timecode');
  const tlMonitorName = document.getElementById('tl-monitor-name');
  const tlMonitorDesc = document.getElementById('tl-monitor-desc');
  const tlClips       = tlTrack ? Array.from(tlTrack.querySelectorAll('.tl-clip')) : [];

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
  const tlRuler = tlBody?.querySelector('.tl-ruler');
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
  const photoSlides = document.querySelectorAll('#tl-media-photo .tl-photo-slide');
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
        pendingClipIdx = idx;
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

  // ── WORD-WRAP REVEAL (reusable) ──
  function wordReveal(selector, stagger = CONFIG.wordRevealStagger) {
    const el = document.querySelector(selector);
    if (!el) return;
    gsap.to(el.querySelectorAll('.word-inner'), {
      y: '0%', duration: CONFIG.wordRevealDuration, ease: 'power4.out', stagger,
      scrollTrigger: { trigger: el, start: 'top 80%' }
    });
  }
  wordReveal('#contact-headline');

  // ── SLIDE TEXT (Valentin Cheval mechanic) ──
  (() => {
    const wrap = document.getElementById('slide-txt-wrap');
    if (!wrap) return;

    const WORDS = [
      'soundtracks', 'storybooks', 'pictures', 'videos',
      'animations', '3D renders', 'websites', 'social'
    ];
    const COLOURS = WORDS.map((_, i) => ['#4427d7','#3b3fe8','#2e45d9','#4f5cf2'][i % 4]);
    const N       = WORDS.length;
    const DUR     = CONFIG.drumWordDuration;
    const EASE    = 'expo.inOut';
    const MAX_ANGLE = CONFIG.drumMaxAngle;  // degrees at fully hidden position

    // Pure rotateX only — the transform-origin: center center -0.26em does the arc.
    // The Y/Z translation in Valentin's DOM is a tiny side-effect of that origin,
    // not a large cylinder offset. GSAP needs matching structure to tween between strings.
    const T_OUT = 'translate3d(0px, 0px, 0px) rotateX(-91deg)';  // below, waiting to come in
    const T_IN  = 'translate3d(0px, 0px, 0px) rotateX(91deg)';   // above, just exited
    const T_MID = 'translate3d(0px, 0px, 0px) rotateX(0deg)';    // fully visible

    // Build elements
    const items = WORDS.map((word, i) => {
      const el = document.createElement('div');
      el.className = 'slide-txt-item';
      el.textContent = word;
      el.style.color = COLOURS[i];
      wrap.appendChild(el);
      return el;
    });

    // Read rotateX degrees from a computed transform string
    function getAngle(el) {
      const t = el.style.transform || '';
      const m = t.match(/rotateX\(([-\d.]+)deg\)/);
      return m ? parseFloat(m[1]) : 0;
    }

    // Opacity derived from angle — matches live DOM: at 0deg=1, at ±91deg=0
    function syncOpacities() {
      items.forEach(el => {
        const angle = getAngle(el);
        el.style.opacity = Math.max(0, 1 - Math.abs(angle) / MAX_ANGLE);
      });
    }

    // Initial state: last word visible, all others at T_OUT (below)
    items.forEach((el, i) => {
      if (i === N - 1) {
        el.style.transform = T_MID;
        el.style.opacity   = '1';
      } else {
        el.style.transform = T_OUT;
        el.style.opacity   = '0';
      }
    });

    // Master timeline — each item gets its own sub-timeline added at position 0
    const tl = gsap.timeline({
      paused: true,
      repeat: -1,
      onUpdate: syncOpacities,
      onRepeat: () => { tl.progress(0); }
    });

    items.forEach((el, i) => {
      const sub = gsap.timeline();

      if (i === N - 1) {
        // Last word starts visible:
        // 1. animate out (to T_IN, upward)
        // 2. wait for all others to cycle
        // 3. snap to T_OUT (below), animate back in
        sub
          .set(el,  { transform: T_MID })
          .to(el,   { transform: T_IN,  duration: DUR, ease: EASE }, '<=0')
          .to(el,   { duration: Math.max(0, DUR * (N - 2)) })
          .set(el,  { transform: T_OUT })
          .to(el,   { transform: T_MID, duration: DUR, ease: EASE });
      } else {
        // Regular word: wait, come in from below (T_OUT→T_MID), exit upward (T_MID→T_IN), wait
        sub
          .set(el,  { transform: T_OUT })
          .to(el,   { duration: DUR * i }, '<=0')
          .to(el,   { transform: T_MID, duration: DUR, ease: EASE })
          .to(el,   { transform: T_IN,  duration: DUR, ease: EASE })
          .to(el,   { duration: DUR * (N - 2 - i) });
      }

      tl.add(sub, 0);
    });

    tl.play();
  })();

  // ── FEATURED WORK GRID — tap to reveal on mobile ──
  if ('ontouchstart' in window) {
    document.querySelectorAll('.fw-grid .fw-card').forEach(card => {
      card.addEventListener('click', () => {
        const wasActive = card.classList.contains('is-tapped');
        document.querySelectorAll('.fw-grid .fw-card.is-tapped').forEach(c => c.classList.remove('is-tapped'));
        if (!wasActive) card.classList.add('is-tapped');
      });
    });
  }

  // ── ABOUT — word-by-word colour sweep ──
  ['#about-p1', '#about-p2', '#about-p3'].forEach(sel => {
    const p = document.querySelector(sel);
    if (!p) return;
    const words = p.innerHTML.split(' ');
    p.innerHTML = words.map(w => `<span class="word-light">${w}</span>`).join(' ');
    p.style.color = 'rgba(237,234,228,.6)';
    gsap.to(p.querySelectorAll('.word-light'), {
      color: 'rgba(237,234,228,1)',
      stagger: { each: CONFIG.wordSweepStagger },
      ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 75%', end: 'bottom 40%', scrub: CONFIG.wordSweepScrub }
    });
  });

  // ── STATS block slide in (desktop only) ──
  if (window.innerWidth >= CONFIG.mobileBreakpoint) {
    gsap.from('#about-stats .stat', {
      opacity: 0, y: 30, duration: .8, ease: 'power3.out', stagger: CONFIG.statsStagger,
      scrollTrigger: { trigger: '#about-stats', start: 'top 80%' }
    });
  }

  // ── STATS — one-at-a-time flip (staggered) ──
  const statCards = document.querySelectorAll('#about-stats .stat');
  let statDelay = null;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const hasTouch = 'ontouchstart' in window;

  statCards.forEach(card => {
    // Pointer devices: hover to flip
    if (hasHover) {
      card.addEventListener('mouseenter', () => {
        clearTimeout(statDelay);
        const flipped = document.querySelector('#about-stats .stat.is-flipped');
        if (flipped && flipped !== card) {
          flipped.classList.remove('is-flipped');
          statDelay = setTimeout(() => card.classList.add('is-flipped'), CONFIG.statFlipDelay);
        } else if (!flipped) {
          card.classList.add('is-flipped');
        }
      });
      card.addEventListener('mouseleave', () => {
        clearTimeout(statDelay);
        card.classList.remove('is-flipped');
      });
    }
    // Touch devices: tap to toggle flip
    if (hasTouch) {
      card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
        const hint = document.getElementById('stat-tap-hint');
        if (hint) hint.classList.add('is-hidden');
      });
    }
    // Keyboard: Enter/Space to flip
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('is-flipped');
      }
    });
  });

  // Add tap hint below stats on touch devices
  if (hasTouch && !hasHover) {
    const statsEl = document.getElementById('about-stats');
    if (statsEl) {
      const hint = document.createElement('span');
      hint.className = 'stat-tap-hint';
      hint.id = 'stat-tap-hint';
      hint.textContent = 'Tap to reveal';
      statsEl.insertAdjacentElement('afterend', hint);
    }
  }

  // ── CONTACT ──
  gsap.to('#contact-right', {
    opacity: 1, y: 0, duration: CONFIG.contactRevealDuration, ease: 'power3.out',
    scrollTrigger: { trigger: '#contact', start: 'top 72%' }
  });
}

// ── NEON HERO — Matter.js physics cables ──
(() => {
  const hero = document.querySelector('.hero-neon');
  const toggle = document.getElementById('neon-toggle');
  const canvas = document.getElementById('cable-canvas');
  if (!hero || !toggle || !canvas) return;

  const ctx = canvas.getContext('2d');
  const REF_W = CONFIG.cableRefW, REF_H = CONFIG.cableRefH;
  const SIGN_W = CONFIG.cableSignW, SIGN_H = CONFIG.cableSignH;
  const SIGN_X = (REF_W - SIGN_W) / 2;
  const SIGN_Y = (REF_H - SIGN_H) / 2;
  const WIRE_THICKNESS = CONFIG.cableWireThickness; // base cable width — glow and highlight scale from this

  // Anchor pairs in 2560x1440 coordinate space
  const ANCHORS = [
    [[545,728],[961,777]],
    [[1353,803],[1234,812]],
    [[1671,737],[1842,864]],
    [[649,620],[815,714]],
    [[882,567],[1011,564]],
    [[1152,648],[1282,670]],
    [[1464,496],[1674,717]],
  ];

  const isTouchDevice = !window.matchMedia('(hover: hover)').matches;
  let engine, runner, world, mouseBody, cables = [];
  let neonOn = false;
  let animFrame = null;
  let debugDragging = false;

  function sizeCanvas() {
    const rect = hero.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }

  function scale(x, y) {
    // The sign is now a separate CSS-positioned element.
    // Find its actual rendered bounds on screen and map anchors accordingly.
    const signEl = document.querySelector('.hero-sign-off');
    if (signEl) {
      const heroRect = hero.getBoundingClientRect();
      const signRect = signEl.getBoundingClientRect();
      // Sign's position relative to hero, in canvas pixel space
      const dpr = devicePixelRatio;
      const signLeft = (signRect.left - heroRect.left) * dpr;
      const signTop = (signRect.top - heroRect.top) * dpr;
      const signW = signRect.width * dpr;
      const signH = signRect.height * dpr;
      // Map anchor from 2560x1440 ref space to sign's rendered position
      // Anchors are relative to the full 2560x1440 frame where sign sits at SIGN_X, SIGN_Y
      const relX = (x - SIGN_X) / SIGN_W; // 0-1 within sign bounds
      const relY = (y - SIGN_Y) / SIGN_H;
      return {
        x: signLeft + relX * signW,
        y: signTop + relY * signH,
      };
    }
    // Fallback
    return { x: x * (canvas.width / REF_W), y: y * (canvas.height / REF_H) };
  }

  function buildCables() {
    const { Engine, Runner, Bodies, Body, Composite, Constraint } = Matter;

    engine = Engine.create({ gravity: { x: 0, y: 1 } });
    world = engine.world;
    runner = Runner.create();

    // Mouse interaction body — skip on touch devices
    if (!isTouchDevice) {
      mouseBody = Bodies.circle(0, 0, CONFIG.cableMouseRadius, {
        isStatic: true,
        collisionFilter: { category: 0x0002, mask: 0x0001 },
      });
      Composite.add(world, mouseBody);
    }

    cables = ANCHORS.map(([a, b]) => {
      const pa = scale(a[0], a[1]);
      const pb = scale(b[0], b[1]);
      const dx = pb.x - pa.x, dy = pb.y - pa.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const segs = Math.max(CONFIG.cableMinSegs, Math.round(dist / CONFIG.cableSegDivisor));
      const segLen = dist / segs;

      const bodies = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const x = pa.x + dx * t;
        const y = pa.y + dy * t;
        const isEnd = i === 0 || i === segs;
        const body = Bodies.circle(x, y, CONFIG.cableSegRadius, {
          isStatic: isEnd,
          frictionAir: CONFIG.cableFrictionAir,
          collisionFilter: isEnd
            ? { category: 0x0004, mask: 0 }
            : { category: 0x0001, mask: 0x0002 },
        });
        bodies.push(body);
      }
      Composite.add(world, bodies);

      const constraints = [];
      for (let i = 0; i < bodies.length - 1; i++) {
        constraints.push(Constraint.create({
          bodyA: bodies[i],
          bodyB: bodies[i + 1],
          length: segLen,
          stiffness: CONFIG.cableStiffness,
          damping: CONFIG.cableDamping,
        }));
      }
      Composite.add(world, constraints);

      return { bodies, constraints, pa, pb };
    });

    Runner.run(runner, engine);
  }

  function destroyCables() {
    if (runner) Matter.Runner.stop(runner);
    if (engine) Matter.Engine.clear(engine);
    if (world) Matter.Composite.clear(world);
    engine = null; runner = null; world = null; mouseBody = null;
    cables = [];
  }

  // Catmull-Rom spline helper
  function catmullRom(pts, steps) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[Math.min(i + 1, pts.length - 1)];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const t2 = t * t, t3 = t2 * t;
        out.push({
          x: 0.5 * (2*p1.x + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
          y: 0.5 * (2*p1.y + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
        });
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  function lerpColor(a, b, t) {
    const parse = c => [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)];
    const ca = parse(a), cb = parse(b);
    const r = Math.round(ca[0]+(cb[0]-ca[0])*t);
    const g = Math.round(ca[1]+(cb[1]-ca[1])*t);
    const bl = Math.round(ca[2]+(cb[2]-ca[2])*t);
    return `rgb(${r},${g},${bl})`;
  }

  function drawCables() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Zone-based colour: upper 45% = warm, lower 55% = cool
    const zoneBreak = canvas.height * CONFIG.cableZoneBreak;
    function zoneColor(y, warmA, warmB, coolA, coolB) {
      if (y <= zoneBreak) {
        const t = y / zoneBreak;
        return lerpColor(warmA, warmB, t);
      }
      const t = (y - zoneBreak) / (canvas.height - zoneBreak);
      return lerpColor(coolA, coolB, t);
    }

    cables.forEach(cable => {
      const pts = cable.bodies.map(b => ({ x: b.position.x, y: b.position.y }));
      const spline = catmullRom(pts, CONFIG.cableSplineSteps);
      if (spline.length < 2) return;

      // Build zone-based gradient along the cable
      function makeZoneGrad(warmA, warmB, coolA, coolB) {
        const grad = ctx.createLinearGradient(
          spline[0].x, spline[0].y,
          spline[spline.length - 1].x, spline[spline.length - 1].y
        );
        const stops = [0, 0.25, 0.5, 0.75, 1];
        stops.forEach(t => {
          const idx = Math.min(Math.floor(t * (spline.length - 1)), spline.length - 1);
          const y = spline[idx].y;
          grad.addColorStop(t, zoneColor(y, warmA, warmB, coolA, coolB));
        });
        return grad;
      }

      // Three-pass rendering: glow (blurred) → body (sharp) → highlight (blurred)
      // Scale thickness proportionally with canvas size
      const wireScale = canvas.width / REF_W;
      const wt = WIRE_THICKNESS * wireScale;
      const passes = neonOn
        ? [
            { width: wt * CONFIG.cableGlowWidthMul, alpha: CONFIG.cableGlowAlpha, glow: true },
            { width: wt,       alpha: 1,    body: true },
            { width: wt * CONFIG.cableHighlightWidthMul, alpha: CONFIG.cableHighlightAlphaOn, highlight: true },
          ]
        : [
            { width: wt,       alpha: 1,    off: true },
            { width: wt * CONFIG.cableHighlightWidthMul, alpha: CONFIG.cableHighlightAlphaOff, off: true, highlight: true },
          ];

      // Cable shadow — applied before all passes
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = CONFIG.cableShadowBlur;
      ctx.shadowOffsetX = CONFIG.cableShadowOffsetX;
      ctx.shadowOffsetY = CONFIG.cableShadowOffsetY;

      passes.forEach(pass => {
        // Blur control per pass
        if (pass.glow) ctx.filter = 'blur(4px)';
        else if (pass.highlight) ctx.filter = 'blur(2px)';
        else ctx.filter = 'none';

        // Shadow only on first pass to avoid stacking
        if (!pass.glow && !pass.off) {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        ctx.beginPath();
        ctx.moveTo(spline[0].x, spline[0].y);
        for (let i = 1; i < spline.length; i++) {
          ctx.lineTo(spline[i].x, spline[i].y);
        }
        ctx.lineWidth = pass.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = pass.alpha;

        if (pass.off && !pass.highlight) {
          ctx.strokeStyle = '#2a2a2a';
        } else if (pass.off && pass.highlight) {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        } else if (pass.highlight) {
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        } else {
          ctx.strokeStyle = makeZoneGrad('#fff5dc', '#ffcc88', '#8899ff', '#5b6cff');
        }

        ctx.stroke();
        ctx.filter = 'none';
      });

      // Reset shadow after all passes for this cable
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });

    ctx.restore();
  }

  function renderLoop() {
    drawCables();
    animFrame = requestAnimationFrame(renderLoop);
  }

  // Mouse tracking
  canvas.addEventListener('mousemove', e => {
    if (!mouseBody || debugDragging) return;
    const rect = hero.getBoundingClientRect();
    Matter.Body.setPosition(mouseBody, {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    });
  }, { passive: true });

  // Draw off-state cables immediately
  function drawOffCables() {
    sizeCanvas();
    // Build temporary static points for off-state rendering
    cables = ANCHORS.map(([a, b]) => {
      const pa = scale(a[0], a[1]);
      const pb = scale(b[0], b[1]);
      const segs = CONFIG.cableOffStateSegs;
      const bodies = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const sag = Math.sin(t * Math.PI) * CONFIG.cableOffStateSag;
        bodies.push({ position: { x: pa.x + (pb.x-pa.x)*t, y: pa.y + (pb.y-pa.y)*t + sag } });
      }
      return { bodies, pa, pb };
    });
    drawCables();
  }

  // Toggle handler
  toggle.addEventListener('change', () => {
    neonOn = toggle.checked;
    if (neonOn) {
      hero.classList.add('neon-on');
      sizeCanvas();
      buildCables();
      renderLoop();
    } else {
      hero.classList.remove('neon-on');
      if (animFrame) cancelAnimationFrame(animFrame);
      animFrame = null;
      destroyCables();
      drawOffCables();
    }
  });

  // Resize and orientation change handler
  function handleResize() {
    if (neonOn && mouseBody) {
      if (animFrame) cancelAnimationFrame(animFrame);
      destroyCables();
      sizeCanvas();
      buildCables();
      renderLoop();
    } else {
      drawOffCables();
    }
  }
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', () => setTimeout(handleResize, CONFIG.orientationDelay));

  // Initial draw
  sizeCanvas();
  drawOffCables();

  // ── DEBUG MODE (?debug=1) ──
  const DEBUG = new URLSearchParams(window.location.search).get('debug') === '1';
  if (DEBUG) {
    const DOT_R = CONFIG.debugDotRadius;
    const HIT_R = CONFIG.debugHitRadius;
    let dragTarget = null; // { ci: cableIndex, ei: 0|1 }

    function canvasXY(e) {
      const rect = hero.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
      };
    }

    function unscale(px, py) {
      const signEl = document.querySelector('.hero-sign-off');
      if (signEl) {
        const heroRect = hero.getBoundingClientRect();
        const signRect = signEl.getBoundingClientRect();
        const dpr = devicePixelRatio;
        const signLeft = (signRect.left - heroRect.left) * dpr;
        const signTop = (signRect.top - heroRect.top) * dpr;
        const signW = signRect.width * dpr;
        const signH = signRect.height * dpr;
        const relX = (px - signLeft) / signW;
        const relY = (py - signTop) / signH;
        return {
          x: Math.round(SIGN_X + relX * SIGN_W),
          y: Math.round(SIGN_Y + relY * SIGN_H),
        };
      }
      return {
        x: Math.round(px / (canvas.width / REF_W)),
        y: Math.round(py / (canvas.height / REF_H)),
      };
    }

    function drawDebugDots() {
      ANCHORS.forEach(([a, b]) => {
        [scale(a[0], a[1]), scale(b[0], b[1])].forEach(p => {
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, DOT_R, 0, Math.PI * 2);
          ctx.fillStyle = 'red';
          ctx.fill();
        });
      });
    }

    function hitTest(mx, my) {
      const r2 = HIT_R * HIT_R;
      for (let ci = 0; ci < ANCHORS.length; ci++) {
        const [a, b] = ANCHORS[ci];
        const pa = scale(a[0], a[1]);
        const pb = scale(b[0], b[1]);
        for (let ei = 0; ei < 2; ei++) {
          const p = ei === 0 ? pa : pb;
          const dx = mx - p.x, dy = my - p.y;
          if (dx * dx + dy * dy <= r2) return { ci, ei };
        }
      }
      return null;
    }

    // Rebuild a single cable's physics bodies and constraints in-place
    function rebuildSingleCable(ci) {
      if (!world) return;
      const { Bodies, Composite, Constraint } = Matter;
      const cable = cables[ci];
      if (!cable) return;

      // Remove old bodies and constraints from world
      cable.bodies.forEach(b => Composite.remove(world, b));
      if (cable.constraints) cable.constraints.forEach(c => Composite.remove(world, c));

      const [a, b] = ANCHORS[ci];
      const pa = scale(a[0], a[1]);
      const pb = scale(b[0], b[1]);
      const dx = pb.x - pa.x, dy = pb.y - pa.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const segs = Math.max(CONFIG.cableMinSegs, Math.round(dist / CONFIG.cableSegDivisor));
      const segLen = dist / segs;

      const bodies = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const isEnd = i === 0 || i === segs;
        const body = Bodies.circle(pa.x + dx * t, pa.y + dy * t, CONFIG.cableSegRadius, {
          isStatic: isEnd,
          frictionAir: CONFIG.cableFrictionAir,
          collisionFilter: isEnd
            ? { category: 0x0004, mask: 0 }
            : { category: 0x0001, mask: 0x0002 },
        });
        bodies.push(body);
      }
      Composite.add(world, bodies);

      const constraints = [];
      for (let i = 0; i < bodies.length - 1; i++) {
        constraints.push(Constraint.create({
          bodyA: bodies[i],
          bodyB: bodies[i + 1],
          length: segLen,
          stiffness: CONFIG.cableStiffness,
          damping: CONFIG.cableDamping,
        }));
      }
      Composite.add(world, constraints);

      cables[ci] = { bodies, constraints, pa, pb };
    }

    function logAnchors() {
      const lines = ANCHORS.map(([a, b]) =>
        `  {ax1: ${a[0]}, ay1: ${a[1]}, ax2: ${b[0]}, ay2: ${b[1]}}`
      );
      console.log('const anchors = [\n' + lines.join(',\n') + '\n];');
    }

    // Patch drawCables to append debug dots after normal rendering
    const _origDraw = drawCables;
    drawCables = function() {
      _origDraw();
      drawDebugDots();
    };

    // In debug mode, raise canvas above sign layers so it receives clicks,
    // and make sign images pass-through so anchors are always clickable.
    canvas.style.pointerEvents = 'auto';
    canvas.style.zIndex = '20';
    canvas.style.cursor = 'crosshair';
    document.querySelector('.hero-ui').style.zIndex = '21';

    hero.addEventListener('mousedown', e => {
      const pos = canvasXY(e);
      const hit = hitTest(pos.x, pos.y);
      if (hit) {
        dragTarget = hit;
        debugDragging = true;
        e.preventDefault();
      }
    });

    window.addEventListener('mousemove', e => {
      if (!dragTarget) return;
      e.preventDefault();

      const pos = canvasXY(e);
      const ref = unscale(pos.x, pos.y);
      ANCHORS[dragTarget.ci][dragTarget.ei][0] = ref.x;
      ANCHORS[dragTarget.ci][dragTarget.ei][1] = ref.y;

      if (neonOn && cables[dragTarget.ci]) {
        rebuildSingleCable(dragTarget.ci);
      } else if (!neonOn) {
        drawOffCables();
      }
    });

    window.addEventListener('mouseup', () => {
      if (dragTarget) {
        dragTarget = null;
        debugDragging = false;
        logAnchors();
      }
    });
  }
})();
