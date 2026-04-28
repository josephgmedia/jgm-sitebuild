/* ============================================================
   NEON HERO — Matter.js physics cables
   ============================================================ */

import { CONFIG } from './config.js';
import Matter from 'matter-js';

(() => {
  const hero = document.querySelector('.hero');
  const toggleOn = document.getElementById('hero-on');
  const toggleOff = document.getElementById('hero-off');
  const canvas = document.getElementById('cable-canvas');
  if (!hero || !toggleOn || !toggleOff || !canvas) return;

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
    const signEl = document.querySelector('.hero__sign--off');
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

  // Toggle handlers
  toggleOn.addEventListener('change', () => {
    if (toggleOn.checked) {
      neonOn = true;
      hero.classList.add('hero--neon-on');
      sizeCanvas();
      buildCables();
      renderLoop();
    }
  });

  toggleOff.addEventListener('change', () => {
    if (toggleOff.checked) {
      neonOn = false;
      hero.classList.remove('hero--neon-on');
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


  // ── TOGGLE TRACK CLICK ──
  const toggleTrack = document.querySelector('.hero__toggle-track');

  if (toggleTrack && toggleOff && toggleOn) {
    toggleTrack.addEventListener('click', (e) => {
      e.preventDefault();
      // Toggle between off and on
      if (toggleOff.checked) {
        toggleOn.checked = true;
        toggleOn.dispatchEvent(new Event('change'));
      } else {
        toggleOff.checked = true;
        toggleOff.dispatchEvent(new Event('change'));
      }
    });
  }

  // ── SCROLL HINT ANIMATION (after 3 seconds) ──
  const scrollHint = document.getElementById('hero-scroll-hint');
  if (scrollHint) {
    setTimeout(() => {
      scrollHint.classList.add('is-visible');
    }, 3000);

    // Hide on scroll
    let scrolled = false;
    window.addEventListener('scroll', () => {
      if (!scrolled && window.scrollY > 50) {
        scrollHint.classList.remove('is-visible');
        scrolled = true;
      }
    });
  }

  // ── VIEW WORK REEL MODAL ──
  const viewWorkBtn = document.getElementById('hero-view-work');
  const reelModal = document.getElementById('reel-modal');
  const reelModalOverlay = document.getElementById('reel-modal-overlay');

  if (viewWorkBtn && reelModal) {
    // Open modal
    viewWorkBtn.addEventListener('click', () => {
      reelModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    // Close modal on overlay click
    if (reelModalOverlay) {
      reelModalOverlay.addEventListener('click', () => {
        reelModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    }

    // Handle reel card clicks (placeholder - you can add video playback here)
    const reelCards = document.querySelectorAll('.reel-card');
    reelCards.forEach(card => {
      card.addEventListener('click', () => {
        const reelType = card.getAttribute('data-reel');
        // TODO: Add video playback logic here
        console.log('Play reel:', reelType);
      });
    });
  }

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
      const signEl = document.querySelector('.hero__sign--off');
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
    document.querySelector('.hero__ui').style.zIndex = '21';

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
