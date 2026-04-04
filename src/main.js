/* ============================================================
   Joseph G Media — main.js
   Dependencies (loaded via CDN in HTML before this file):
   - Matter.js @0.20.0
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
  gsap.to('#hero-foot', { opacity: 1, y: 0, duration: .6, delay: .4, ease: 'power4.out' });

  // ── HERO FOOT — fade, blur & collapse on scroll ──
  const heroFoot = document.getElementById('hero-foot');
  if (heroFoot) {
    ScrollTrigger.create({
      trigger: '.hero-neon',
      start: '2px top',
      end: '+=200',
      scrub: 0.6,
      animation: gsap.fromTo(heroFoot,
        { opacity: 1, filter: 'blur(0px)', height: heroFoot.offsetHeight, paddingTop: 22, paddingBottom: 22, borderTopWidth: 1 },
        { opacity: 0, filter: 'blur(12px)', height: 0, paddingTop: 0, paddingBottom: 0, borderTopWidth: 0, ease: 'none' }
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
    }, 3000);
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
    { name: 'Music Composition & Sound Design', desc: 'Ableton, Logic, Pro Tools \u2014 composition, scoring and sound design',           link: 'work.html#music-composition' },
    { name: 'Web Design',                       desc: 'Custom builds in HTML, CSS, JavaScript, WordPress and Squarespace',                link: 'work.html#web-design' },
    { name: 'AI & Generative Design',           desc: 'Stable Diffusion, ComfyUI \u2014 workflow development and ideation',               link: 'work.html#ai-generative-design' },
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
          switchMonitorMedia(TL_DATA[hitIdx].name);
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
      'documentaries', 'album art', 'press shots', '3D renders', 'animations', 'brand assets'
    ];
    const COLOURS = ['#4427d7','#3b3fe8','#2e45d9','#4f5cf2','#4427d7','#3b3fe8','#2e45d9','#4f5cf2','#4427d7','#3b3fe8'];
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
    const radius = 320;
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
        const mappedScale = 1.05 + scale * 0.1;

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

  // ── STATS block slide in ──
  gsap.from('#about-stats .stat', {
    opacity: 0, y: 30, duration: .8, ease: 'power3.out', stagger: .1,
    scrollTrigger: { trigger: '#about-stats', start: 'top 80%' }
  });

  // ── STATS — one-at-a-time flip (staggered) ──
  const statCards = document.querySelectorAll('#about-stats .stat');
  let statDelay = null;

  statCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      clearTimeout(statDelay);
      const flipped = document.querySelector('#about-stats .stat.is-flipped');
      if (flipped && flipped !== card) {
        flipped.classList.remove('is-flipped');
        statDelay = setTimeout(() => card.classList.add('is-flipped'), 1);
      } else if (!flipped) {
        card.classList.add('is-flipped');
      }
    });
    card.addEventListener('mouseleave', () => {
      clearTimeout(statDelay);
      card.classList.remove('is-flipped');
    });
  });

  // ── CONTACT ──
  gsap.to('#contact-right', {
    opacity: 1, y: 0, duration: .9, ease: 'power3.out',
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
  const REF_W = 2560, REF_H = 1440;
  const WIRE_THICKNESS = 13; // base cable width — glow and highlight scale from this

  // Anchor pairs in 2560x1440 coordinate space
  const ANCHORS = [
    [[487,640],[947,706]],
    [[1374,758],[1249,762]],
    [[1742,662],[1943,818]],
    [[600,513],[782,630]],
    [[822,638],[1011,564]],
    [[1155,536],[1307,571]],
    [[1742,633],[1851,538]],
  ];

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
    return { x: x * (canvas.width / REF_W), y: y * (canvas.height / REF_H) };
  }

  function buildCables() {
    const { Engine, Runner, Bodies, Body, Composite, Constraint } = Matter;

    engine = Engine.create({ gravity: { x: 0, y: 1 } });
    world = engine.world;
    runner = Runner.create();

    // Mouse interaction body
    mouseBody = Bodies.circle(0, 0, 25, {
      isStatic: true,
      collisionFilter: { category: 0x0002, mask: 0x0001 },
    });
    Composite.add(world, mouseBody);

    cables = ANCHORS.map(([a, b]) => {
      const pa = scale(a[0], a[1]);
      const pb = scale(b[0], b[1]);
      const dx = pb.x - pa.x, dy = pb.y - pa.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const segs = Math.max(8, Math.round(dist / 12));
      const segLen = dist / segs;

      const bodies = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const x = pa.x + dx * t;
        const y = pa.y + dy * t;
        const isEnd = i === 0 || i === segs;
        const body = Bodies.circle(x, y, 14, {
          isStatic: isEnd,
          frictionAir: 0.1,
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
          stiffness: 0.5,
          damping: 0.08,
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
    const zoneBreak = canvas.height * 0.45;
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
      const spline = catmullRom(pts, 6);
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
      const passes = neonOn
        ? [
            { width: WIRE_THICKNESS * 2.8, alpha: 0.15, glow: true },
            { width: WIRE_THICKNESS,        alpha: 1,    body: true },
            { width: WIRE_THICKNESS * 0.18, alpha: 0.5,  highlight: true },
          ]
        : [
            { width: WIRE_THICKNESS,        alpha: 1,    off: true },
            { width: WIRE_THICKNESS * 0.18, alpha: 0.25, off: true, highlight: true },
          ];

      // Cable shadow — applied before all passes
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 4;

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
      const segs = 10;
      const bodies = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        // Add subtle sag
        const sag = Math.sin(t * Math.PI) * 15;
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

  // Initial off-state render
  window.addEventListener('resize', () => {
    if (neonOn && mouseBody) {
      // Rebuild physics on resize when active
      if (animFrame) cancelAnimationFrame(animFrame);
      destroyCables();
      sizeCanvas();
      buildCables();
      renderLoop();
    } else {
      drawOffCables();
    }
  });

  // Initial draw
  sizeCanvas();
  drawOffCables();

  // ── DEBUG MODE (?debug=1) ──
  const DEBUG = new URLSearchParams(window.location.search).get('debug') === '1';
  if (DEBUG) {
    const DOT_R = 10;
    const HIT_R = 20;
    let dragTarget = null; // { ci: cableIndex, ei: 0|1 }

    function canvasXY(e) {
      const rect = hero.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
      };
    }

    function unscale(px, py) {
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
      const segs = Math.max(8, Math.round(dist / 12));
      const segLen = dist / segs;

      const bodies = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const isEnd = i === 0 || i === segs;
        const body = Bodies.circle(pa.x + dx * t, pa.y + dy * t, 14, {
          isStatic: isEnd,
          frictionAir: 0.1,
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
          stiffness: 0.5,
          damping: 0.08,
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
