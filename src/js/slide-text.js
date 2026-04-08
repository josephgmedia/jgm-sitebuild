import { CONFIG } from './config.js';
import gsap from 'gsap';

export function initSlideText() {
  // ── SLIDE TEXT (Valentin Cheval mechanic) ──
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
    el.className = 'about__slide-item';
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
}
