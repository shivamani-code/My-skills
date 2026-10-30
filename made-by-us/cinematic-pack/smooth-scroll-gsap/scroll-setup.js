// Lenis + GSAP ScrollTrigger, wired once. Load gsap, ScrollTrigger and lenis first
// (CDN: cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js, .../ScrollTrigger.min.js, cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js)
// or `npm i gsap lenis` and import them.
export function setupScroll({ smooth = true } = {}) {
  gsap.registerPlugin(ScrollTrigger);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;
  if (smooth && !reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, syncTouch: false }); // native touch on phones
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));   // ONE clock for everything
    gsap.ticker.lagSmoothing(0);
  }
  ScrollTrigger.config({ ignoreMobileResize: true }); // URL-bar show/hide doesn't refresh
  return { lenis, velocity: () => (lenis ? lenis.velocity : 0), reduce };
}

// Pinned scene with a scrubbed timeline. el = section, build(tl) adds tweens in 0..1 time.
export function scene(el, build, { length = '+=250%', pin = true, scrub = 0.6 } = {}) {
  const tl = gsap.timeline({ defaults: { ease: 'none' },
    scrollTrigger: { trigger: el, start: 'top top', end: length, pin, scrub, anticipatePin: 1 } });
  build(tl);
  return tl;
}

// Reveal-on-enter for any [data-reveal] element (not scrubbed: plays once).
export function reveals(selector = '[data-reveal]') {
  gsap.utils.toArray(selector).forEach(el => {
    gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });
}
