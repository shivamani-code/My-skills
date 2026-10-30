// Micro-interactions. No deps. ES module.
const fine = matchMedia('(pointer: fine)').matches;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Magnetic element: pulls toward the pointer within `radius`; inner label moves more (parallax).
export function magnetic(el, { strength = 0.35, radius = 120, inner = el.querySelector('span') } = {}) {
  if (!fine || reduce) return () => {};
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
  const tick = () => {
    x += (tx - x) * 0.15; y += (ty - y) * 0.15;
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    if (inner) inner.style.transform = `translate3d(${(x * 0.5).toFixed(2)}px, ${(y * 0.5).toFixed(2)}px, 0)`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0;
  };
  const move = e => {
    const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy);
    [tx, ty] = d < radius + r.width / 2 ? [dx * strength, dy * strength] : [0, 0];
    if (!raf) raf = requestAnimationFrame(tick);
  };
  addEventListener('pointermove', move, { passive: true });
  return () => removeEventListener('pointermove', move);
}

// Touch equivalent: press squash + ripple + tiny haptic. Works everywhere.
export function pressable(el) {
  el.style.position ||= 'relative'; el.style.overflow = 'hidden';
  el.addEventListener('pointerdown', e => {
    if (navigator.vibrate) navigator.vibrate(8);
    if (reduce) return;
    const r = el.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2;
    const dot = document.createElement('i');
    dot.style.cssText = `position:absolute;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px;
      width:${s}px;height:${s}px;border-radius:50%;background:currentColor;opacity:.25;pointer-events:none;
      transform:scale(0);transition:transform .6s cubic-bezier(.16,1,.3,1),opacity .6s`;
    el.appendChild(dot);
    requestAnimationFrame(() => { dot.style.transform = 'scale(1)'; dot.style.opacity = '0'; });
    setTimeout(() => dot.remove(), 650);
    el.animate([{ transform: 'scale(1)' }, { transform: 'scale(.96)' }, { transform: 'scale(1)' }], { duration: 260 });
  });
}

// Custom cursor: a dot that trails and grows over [data-cursor] targets. Desktop only.
export function cursor() {
  if (!fine || reduce) return;
  const c = document.createElement('div');
  c.className = 'cursor';
  c.style.cssText = 'position:fixed;left:0;top:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;' +
    'background:#fff;mix-blend-mode:difference;pointer-events:none;z-index:9999;transition:width .25s,height .25s,margin .25s';
  document.body.appendChild(c);
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  document.addEventListener('pointerover', e => {
    const big = !!e.target.closest('a,button,[data-cursor]');
    c.style.width = c.style.height = big ? '56px' : '12px'; c.style.margin = big ? '-28px 0 0 -28px' : '-6px 0 0 -6px';
  });
  (function loop() { x += (tx - x) * 0.2; y += (ty - y) * 0.2;
    c.style.transform = `translate3d(${x}px, ${y}px, 0)`; requestAnimationFrame(loop); })();
}

// Same-document page transition with the View Transitions API (falls back to instant).
export function transition(update) {
  if (!document.startViewTransition || reduce) return update();
  return document.startViewTransition(update);
}
