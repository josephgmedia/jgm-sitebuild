/* ============================================================
   CONFIG — shared constants
   ============================================================ */

export const CONFIG = {
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
