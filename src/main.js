/* ============================================================
   Joseph G Media — main.js
   Dependencies (loaded via CDN in HTML before this file):
   - Lenis     @1.0.42
   - GSAP      @3.12.5
   - ScrollTrigger @3.12.5
   ============================================================ */

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
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
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
  nav?.classList.toggle('scrolled', scrollY > 60);
}, { passive: true });

// ── MAIN ANIMATIONS (called after loader exits) ──
function initAnimations() {

  // Lenis smooth scroll
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ── HERO ENTRANCE ──
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .to('#greeting',      { opacity: 1, y: 0, duration: .7 }, 0)
    .to('#hero-logo-img', { y: '0%', duration: 1.1 }, .15)
    .to('#hero-bottom',   { opacity: 1, y: 0, duration: .8 }, .6)
    .to('#hero-foot',     { opacity: 1, y: 0, duration: .6 }, .9);

  // ── HERO FOOT — fade, blur & collapse on scroll ──
  const heroFoot = document.getElementById('hero-foot');
  if (heroFoot) {
    ScrollTrigger.create({
      trigger: '.hero',
      start: '2px top',
      end: '+=200',
      scrub: 0.6,
      animation: gsap.fromTo(heroFoot,
        { opacity: 1, filter: 'blur(0px)', height: heroFoot.offsetHeight, paddingTop: 14, paddingBottom: 50, borderTopWidth: 1 },
        { opacity: 0, filter: 'blur(12px)', height: 0, paddingTop: 0, paddingBottom: 0, borderTopWidth: 0, ease: 'none' }
      ),
    });
  }

  // ── BLOB PARALLAX (mouse) ──
  document.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth  - .5) * 30;
    const cy = (e.clientY / window.innerHeight - .5) * 20;
    gsap.to('.blob-1', { x: cx * .4,  y: cy * .3,  duration: 2,   ease: 'power1.out' });
    gsap.to('.blob-2', { x: -cx * .2, y: -cy * .2, duration: 2.5, ease: 'power1.out' });
  }, { passive: true });

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

  function openDrawer() {
    if (!tlMonitor || drawerOpen) return;
    tlMonitor.style.height = '280px';
    tlMonitor.classList.add('is-open');
    drawerOpen = true;
  }

  function closeDrawer() {
    if (!tlMonitor || !drawerOpen) return;
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
      if (tlMonitorName) tlMonitorName.textContent = TL_DATA[idx].name;
      if (tlMonitorDesc) tlMonitorDesc.textContent = TL_DATA[idx].desc;
      els.forEach(el => { el.style.transition = 'opacity 0.25s ease'; el.style.opacity = '1'; });
    }, 150);
  }

  tlSection?.addEventListener('mouseleave', () => {
    if (clipLeaveTimer) { clearTimeout(clipLeaveTimer); clipLeaveTimer = null; }
    mouseOverClip = false;
    mouseOverMonitor = false;
    scrubActive = false;
    closeDrawer();
  });

  const VIDEO_MAP = {
    'Motion Design':                    'src/assets/video/Mograph-Snipet.webm',
    '2D Animation':                     'src/assets/video/Mograph-Snipet.webm',
    '3D Animation':                     'src/assets/video/3D-Snipet.webm',
    'Photography':                      'src/assets/video/Video-Snipet.webm',
    'Videography':                      'src/assets/video/Video-Snipet.webm',
    'Video Editing':                    'src/assets/video/Video-Snipet.webm',
    'Colour Grading':                   'src/assets/video/Video-Snipet.webm',
    'Design & Illustration':            'src/assets/video/Mograph-Snipet.webm',
    'Music Composition & Sound Design': 'src/assets/video/Mograph-Snipet.webm',
    'Web Design':                       'src/assets/video/Mograph-Snipet.webm',
    'AI & Generative Design':           'src/assets/video/Mograph-Snipet.webm',
  };

  let vidA = document.getElementById('tl-monitor-vid-a');
  let vidB = document.getElementById('tl-monitor-vid-b');
  let activeVid   = vidA;
  let standbyVid  = vidB;
  let currentVideoSrc = VIDEO_MAP['Motion Design'];
  if (vidA) gsap.set(vidA, { opacity: 1 });
  if (vidB) gsap.set(vidB, { opacity: 0 });

  function switchMonitorVideo(newSrc) {
    if (!standbyVid || newSrc === currentVideoSrc) return;
    currentVideoSrc = newSrc;
    standbyVid.src = newSrc;
    standbyVid.load();
    standbyVid.play();
    gsap.to(activeVid,  { opacity: 0, duration: 0.4, ease: 'none' });
    gsap.to(standbyVid, { opacity: 1, duration: 0.4, ease: 'none', onComplete: () => {
      [activeVid, standbyVid] = [standbyVid, activeVid];
    }});
  }

  const TL_DATA = [
    { name: 'Motion Design',                    desc: 'After Effects, expressions, rigging, complex comp structures',   link: 'work.html#motion-design' },
    { name: '2D Animation',                     desc: 'Character animation, frame-by-frame, motion graphics',           link: 'work.html#2d-animation' },
    { name: '3D Animation',                     desc: 'Cinema 4D, MoGraph, Redshift rendering, dynamics',               link: 'work.html#3d-animation' },
    { name: 'Photography',                      desc: 'Commercial, portrait, event and press photography',              link: 'work.html#photography' },
    { name: 'Videography',                      desc: 'Direction, capture, multi-format production',                    link: 'work.html#videography' },
    { name: 'Video Editing',                    desc: 'Premiere Pro, Resolve, multi-cam, long and short form',          link: 'work.html#video-editing' },
    { name: 'Colour Grading',                   desc: 'DaVinci Resolve, LUT development, cinematic grade',             link: 'work.html#colour-grading' },
    { name: 'Design & Illustration',            desc: 'Brand, print, OOH, social, promotional, illustration',          link: 'work.html#design-illustration' },
    { name: 'Music Composition & Sound Design', desc: 'Ableton, Logic, Pro Tools — composition and sound design',       link: 'work.html#music-composition' },
    { name: 'Web Design',                       desc: 'Responsive design, UI/UX, front-end development',               link: 'work.html#web-design' },
    { name: 'AI & Generative Design',           desc: 'Midjourney, ComfyUI, Gemini — workflow and ideation',            link: 'work.html#ai-generative-design' },
  ];

  // Make each clip clickable — navigates to the relevant work page
  tlClips.forEach((cl, i) => {
    cl.style.cursor = 'pointer';
    cl.addEventListener('click', () => {
      if (TL_DATA[i]?.link) window.location.href = TL_DATA[i].link;
    });
  });

  if (tlBody && tlPlayhead && tlClips.length) {
    const TOTAL_FRAMES = 750;
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

    function pad(n) { return String(n).padStart(2, '0'); }
    function toTimecode(f) {
      const ff = f % 25;
      const ss = Math.floor(f / 25) % 60;
      const mm = Math.floor(f / 1500) % 60;
      const hh = Math.floor(f / 90000);
      return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
    }

    (function tlTick() {
      // Only update playhead position when mouse is over ruler/track
      if (scrubActive) {
        targetX  = Math.max(0, Math.min(bodyRect.width, mouseClientX - bodyRect.left));
      }
      currentX += (targetX - currentX) * 0.08;

      tlPlayhead.style.transform = `translateX(${currentX}px)`;

      const frac = bodyRect.width > 0 ? currentX / bodyRect.width : 0;
      tlTimecode.textContent = toTimecode(Math.round(frac * TOTAL_FRAMES));

      let hitIdx = -1;
      tlClips.forEach((cl, i) => {
        const b   = clipRects[i];
        const hit = b && currentX >= b.left && currentX <= b.right;
        cl.classList.toggle('is-active', !!hit);
        const monitorHit = b && targetX >= b.left - 4 && targetX <= b.right + 4;
        if (monitorHit) hitIdx = i;
      });

      const keepOpen = mouseOverClip || mouseOverMonitor;

      if (keepOpen && hitIdx >= 0) {
        if (clipLeaveTimer) { clearTimeout(clipLeaveTimer); clipLeaveTimer = null; }
        openDrawer();
        if (hitIdx !== monitorIdx) {
          monitorIdx = hitIdx;
          crossfadeContent(hitIdx);
          switchMonitorVideo(VIDEO_MAP[TL_DATA[hitIdx].name]);
        }
      } else if (keepOpen && drawerOpen) {
        // Mouse is in monitor but not on a clip — keep drawer open, don't change content
        if (clipLeaveTimer) { clearTimeout(clipLeaveTimer); clipLeaveTimer = null; }
      } else if (drawerOpen && !clipLeaveTimer) {
        clipLeaveTimer = setTimeout(() => { closeDrawer(); clipLeaveTimer = null; }, 800);
      }

      requestAnimationFrame(tlTick);
    })();
  }

  // ── WORD-WRAP REVEAL (reusable) ──
  function wordReveal(selector, stagger = 0.16) {
    const el = document.querySelector(selector);
    if (!el) return;
    gsap.to(el.querySelectorAll('.word-inner'), {
      y: '0%', duration: 1, ease: 'power4.out', stagger,
      scrollTrigger: { trigger: el, start: 'top 80%' }
    });
  }
  wordReveal('#contact-headline');

  // ── SLIDE TEXT (Valentin Cheval mechanic) ──
  (() => {
    const wrap = document.getElementById('slide-txt-wrap');
    if (!wrap) return;

    const WORDS = [
      'projection shows', 'music videos', "children's books", 'motion graphics',
      'photography', 'album art', 'press shots', '3D renders', 'web tools', 'brand assets'
    ];
    const COLOURS = ['#5b6cff','#9b8bff','#7c4ddb','#6b5ce7','#5b6cff','#9b8bff','#7c4ddb','#6b5ce7','#5b6cff','#9b8bff'];
    const N       = WORDS.length;
    const DUR     = 2.5;
    const EASE    = 'expo.inOut';
    const MAX_ANGLE = 91;  // degrees at fully hidden position

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

  // ── FEATURED WORK ROTUNDA ──
  const rotunda = document.getElementById('fw-rotunda');
  if (rotunda) {
    const cards = Array.from(rotunda.querySelectorAll('.fw-card'));
    const count = cards.length;
    const radius = 280;
    let currentAngle = 0;
    let targetAngle = 0;
    let isDragging = false;
    let startX = 0;
    let startAngle = 0;

    function getAngleForIndex(i) {
      return (360 / count) * i;
    }

    function updateRotunda() {
      currentAngle += (targetAngle - currentAngle) * 0.08;

      cards.forEach((card, i) => {
        const cardAngle = (getAngleForIndex(i) + currentAngle) * (Math.PI / 180);
        const x = Math.sin(cardAngle) * radius;
        const z = Math.cos(cardAngle) * radius;
        const scale = (z + radius) / (radius * 2);
        const mappedScale = 0.65 + scale * 0.5;

        card.style.transform = `translate3d(${x}px, 0, ${z}px) scale(${mappedScale})`;
        card.style.zIndex = Math.round(scale * 100);

        const isActive = z > radius * 0.7;
        card.classList.toggle('active', isActive);
      });

      requestAnimationFrame(updateRotunda);
    }

    rotunda.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.clientX;
      startAngle = targetAngle;
      rotunda.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const delta = (e.clientX - startX) * 0.4;
      targetAngle = startAngle + delta;
    });
    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      rotunda.style.cursor = 'grab';
      const snap = 360 / count;
      targetAngle = Math.round(targetAngle / snap) * snap;
    });

    rotunda.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startAngle = targetAngle;
    }, { passive: true });
    rotunda.addEventListener('touchmove', e => {
      const delta = (e.touches[0].clientX - startX) * 0.4;
      targetAngle = startAngle + delta;
    }, { passive: true });
    rotunda.addEventListener('touchend', () => {
      const snap = 360 / count;
      targetAngle = Math.round(targetAngle / snap) * snap;
    });

    updateRotunda();
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
      stagger: { each: .04 },
      ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 75%', end: 'bottom 40%', scrub: .5 }
    });
  });

  // ── STATS — count up ──
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    gsap.fromTo(
      { val: 0 }, { val: target },
      {
        duration: 1.4, ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(this.targets()[0].val) + suffix; },
        scrollTrigger: { trigger: el, start: 'top 80%' }
      }
    );
  });
  document.querySelectorAll('[data-text]').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 80%',
      onEnter: () => { el.textContent = el.dataset.text; }
    });
  });

  // ── STATS block slide in ──
  gsap.from('#about-stats .stat', {
    opacity: 0, y: 30, duration: .8, ease: 'power3.out', stagger: .1,
    scrollTrigger: { trigger: '#about-stats', start: 'top 80%' }
  });

  // ── CONTACT ──
  gsap.to('#contact-right', {
    opacity: 1, y: 0, duration: .9, ease: 'power3.out',
    scrollTrigger: { trigger: '#contact', start: 'top 72%' }
  });
}
