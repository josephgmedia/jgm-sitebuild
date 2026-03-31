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

// ── LOADER ──
const loader     = document.getElementById('loader');
const loaderLogo = document.getElementById('loader-logo');
const loaderBar  = document.getElementById('loader-bar');

let prog = 0;
const loaderTick = setInterval(() => {
  prog += Math.random() * 18;
  if (prog >= 100) { prog = 100; clearInterval(loaderTick); }
  if (loaderBar) loaderBar.style.width = prog + '%';
}, 80);

if (loaderLogo) gsap.to(loaderLogo, { opacity: 1, duration: .6, ease: 'power2.out' });

window.addEventListener('load', () => {
  prog = 100;
  if (loaderBar) loaderBar.style.width = '100%';
  setTimeout(() => {
    gsap.to(loader, {
      yPercent: -100, duration: 1, ease: 'power4.inOut',
      onComplete: () => {
        if (loader) loader.style.display = 'none';
        initAnimations();
      }
    });
  }, 400);
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

document.querySelectorAll('a, .work-card, .tl-clip, .stat').forEach(el => {
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

  // ── BLOB PARALLAX (mouse) ──
  document.addEventListener('mousemove', e => {
    const cx = (e.clientX / window.innerWidth  - .5) * 30;
    const cy = (e.clientY / window.innerHeight - .5) * 20;
    gsap.to('.blob-1', { x: cx * .4,  y: cy * .3,  duration: 2,   ease: 'power1.out' });
    gsap.to('.blob-2', { x: -cx * .2, y: -cy * .2, duration: 2.5, ease: 'power1.out' });
  }, { passive: true });

  // ── DISCIPLINES TIMELINE ──
  const tlBody        = document.getElementById('tl-body');
  const tlTrack       = document.getElementById('tl-track');
  const tlPlayhead    = document.getElementById('tl-playhead');
  const tlTimecode    = document.getElementById('tl-timecode');
  const tlMonitorName = document.getElementById('tl-monitor-name');
  const tlMonitorDesc = document.getElementById('tl-monitor-desc');
  const tlClips       = tlTrack ? Array.from(tlTrack.querySelectorAll('.tl-clip')) : [];

  const VIDEO_MAP = {
    'Motion Design':    'src/assets/video/Mograph-Snipet.webm',
    '2D Animation':     'src/assets/video/Mograph-Snipet.webm',
    '3D Animation':     'src/assets/video/3D-Snipet.webm',
    'Photography':      'src/assets/video/Video-Snipet.webm',
    'Videography':      'src/assets/video/Video-Snipet.webm',
    'Video Editing':    'src/assets/video/Video-Snipet.webm',
    'Colour Grading':   'src/assets/video/Video-Snipet.webm',
    'Graphic Design':   'src/assets/video/Mograph-Snipet.webm',
    'Retouching':       'src/assets/video/Video-Snipet.webm',
    'Music Production': 'src/assets/video/Mograph-Snipet.webm',
    'AI Integration':   'src/assets/video/Mograph-Snipet.webm',
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
    { name: 'Motion Design',    desc: 'After Effects, expressions, rigging, complex comp structures' },
    { name: '2D Animation',     desc: 'Character animation, frame-by-frame, motion graphics' },
    { name: '3D Animation',     desc: 'Cinema 4D, MoGraph, Redshift rendering, dynamics' },
    { name: 'Photography',      desc: 'Commercial, portrait, event and press photography' },
    { name: 'Videography',      desc: 'Direction, capture, multi-format production' },
    { name: 'Video Editing',    desc: 'Premiere Pro, Resolve, multi-cam, long and short form' },
    { name: 'Colour Grading',   desc: 'DaVinci Resolve, LUT development, cinematic grade' },
    { name: 'Graphic Design',   desc: 'Brand, print, OOH, social, promotional' },
    { name: 'Retouching',       desc: 'Photoshop compositing, skin, product, campaign' },
    { name: 'Music Production', desc: 'Ableton, Logic, Pro Tools — composition and sound design' },
    { name: 'AI Integration',   desc: 'Midjourney, ComfyUI, Gemini — workflow and ideation' },
  ];

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

    document.addEventListener('mousemove', e => {
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
      targetX  = Math.max(0, Math.min(bodyRect.width, mouseClientX - bodyRect.left));
      currentX += (targetX - currentX) * 0.08;

      tlPlayhead.style.transform = `translateX(${currentX}px)`;

      const frac = bodyRect.width > 0 ? currentX / bodyRect.width : 0;
      tlTimecode.textContent = toTimecode(Math.round(frac * TOTAL_FRAMES));

      let hitIdx = -1;
      tlClips.forEach((cl, i) => {
        const b   = clipRects[i];
        const hit = b && currentX >= b.left && currentX <= b.right;
        cl.classList.toggle('is-active', !!hit);
        if (hit) hitIdx = i;
      });

      if (hitIdx >= 0 && hitIdx !== monitorIdx) {
        monitorIdx = hitIdx;
        if (tlMonitorName) tlMonitorName.textContent = TL_DATA[hitIdx].name;
        if (tlMonitorDesc) tlMonitorDesc.textContent = TL_DATA[hitIdx].desc;
        switchMonitorVideo(VIDEO_MAP[TL_DATA[hitIdx].name]);
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

  // ── ABOUT DRUM ──
  const drumEl = document.getElementById('about-drum');
  if (drumEl) {
    const words   = Array.from(drumEl.querySelectorAll('.about-drum-word'));
    const COLOURS = ['#5b6cff', '#9b8bff', '#7c4ddb', '#6b5ce7', '#5b6cff'];
    const TRANSIT = 0.44;
    const HOLD    = 1.25;

    // Axis sits behind the text by half the container height —
    // all words share the same rotation point in space
    const halfH = drumEl.parentElement.offsetHeight / 2;
    gsap.set(words, {
      transformOrigin: `center center -${halfH}px`,
      rotateX: 90,
      opacity: 0,
    });

    let current = 0;

    function drumNext() {
      const w      = words[current];
      const colour = COLOURS[current % COLOURS.length];

      gsap.set(w, { rotateX: 90, opacity: 0, color: colour });

      gsap.timeline({
        onComplete: () => {
          current = (current + 1) % words.length;
          drumNext();
        }
      })
        // Enter from top: rotateX 90 → 0, opacity snaps on the instant it starts moving
        .to(w, { rotateX: 0, duration: TRANSIT, ease: 'power2.out' }, 0)
        .to(w, { opacity: 1, duration: 0.02, ease: 'none' }, 0)

        // Exit downward: rotateX 0 → -90, opacity snaps off at ~85% through exit (>80°)
        .to(w, { rotateX: -90, duration: TRANSIT, ease: 'power2.in' }, `+=${HOLD}`)
        .to(w, { opacity: 0, duration: 0.02, ease: 'none' }, `<+=${TRANSIT * 0.85}`);
    }

    drumNext();
  }

  // ── WORK SECTION ──
  const workLine = document.getElementById('work-line');
  if (workLine) {
    gsap.to(workLine, {
      scaleX: 1, duration: 1.2, ease: 'power4.inOut',
      scrollTrigger: { trigger: '#work', start: 'top 75%' }
    });
  }
  gsap.fromTo(
    ['#wc1', '#wc2', '#wc3'],
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .12,
      scrollTrigger: { trigger: '#work', start: 'top 70%' }
    }
  );

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
