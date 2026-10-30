---
name: mobile-perf-budget
description: "Keep cinematic sites fast on a mid-range Android: hard budgets, loading tiers, reduced-motion versions, and a Playwright check at 412x915 with Android UA, touch, 4x CPU throttle and 4G (LCP, CLS, long tasks, scroll FPS, bytes, screenshots). Use before every publish and after every big visual change."
---
# Mobile perf budget

Most visitors arrive from a link on a phone. If the first frame takes 6 s, the film never plays. Budget first, effects second.

## Files
- `check_mobile.py`: `python3 check_mobile.py http://localhost:8080/ out/m` -> JSON metrics + `-top/-mid/-end.png` screenshots + `over_budget` list.

## The budget (mid-range Android: Snapdragon 6-series / Galaxy A / Moto G, 4G)
| Metric | Budget |
|---|---|
| First load transfer (before scroll) | <= 1.5 MB |
| Total page weight after full scroll | <= 6 MB (frames included) |
| LCP (poster/hero text) | <= 2.5 s on throttled 4G |
| CLS | <= 0.1 |
| Long tasks during load | <= 600 ms total |
| Scroll FPS at 4x CPU throttle | >= 45 (aim 60) |
| JS (compressed) | <= 150 KB without Three.js, <= 350 KB with |
| WebGL contexts | 1 (2 max) |

## Loading tiers
1. Tier 0 (instant): HTML, CSS, display font, poster WebP, first scrub frame. Real text in the DOM.
2. Tier 1 (after first paint): scroll engine + coarse frames (every 12th) + FX shader.
3. Tier 2 (idle / on approach): remaining frames, 3D models, audio, below-fold images (`loading=lazy`, IntersectionObserver with 1 screen of rootMargin).
4. Pick asset tier by `innerWidth`, `navigator.deviceMemory`, `navigator.connection.saveData` / `effectiveType`. Save-Data or 2G/3G: poster + text only.

## Reduced motion
`@media (prefers-reduced-motion: reduce)`: no smooth scroll, no scrub (poster image per section), no particles, instant reveals. It must still look designed.

## Steps
1. Serve locally: `python3 -m http.server 8080` (in the site dir; kill it after).
2. Run `check_mobile.py`; read `over_budget`; look at the 3 screenshots (text readable? safe areas? nothing cut off at 412 px?).
3. Fix the biggest offender, re-run. Lighthouse alternative: `npx lighthouse URL --preset=perf --form-factor=mobile --quiet --output=json` (slower, needs Chrome path).

## Pitfalls
- In headless Chrome (no GPU), renders WebGL in software (SwiftShader), so FPS/long tasks read worse than a real phone GPU for shader/3D pages. Compare runs against each other; confirm on a real phone before blaming the GPU.
- Testing only on a desktop viewport: Android URL bar, `100vh`, touch scrolling and DPR 2.6 all behave differently.
- Measuring without CPU throttling: a dev machine is 5-10x faster than the target phone.
- Fonts: 4 weights of 2 families = 400 KB. Subset, WOFF2, 2-3 files max.
- Autoplaying audio/video without `muted playsinline`: blocked on mobile.
- Images without width/height: layout shift.
- Forgetting to stop rAF loops off-screen: battery drain, thermal throttling after 30 s.
