// Kinetic type helpers. No deps. ES module.
// splitLetters(el)            -> wraps each letter in <span class="ch" style="--i:n">
// depthField(stage, words)    -> words placed down the Z axis; .update(p) flies the camera through
// velocityStretch(el, getV)   -> scaleY/skew from scroll velocity (Lenis: () => lenis.velocity)
// tiltToPointer(el, max)      -> subtle 3D tilt from pointer / device orientation

export function splitLetters(el) {
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.textContent = '';
  [...text].forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'ch'; s.setAttribute('aria-hidden', 'true');
    s.style.setProperty('--i', i);
    s.textContent = c === ' ' ? '\u00a0' : c;
    el.appendChild(s);
  });
  return [...el.children];
}

// stage: element with perspective; words: array of strings.
// gap: Z distance between words (px). Each word fades in from fog, passes the camera, and is culled.
export function depthField(stage, words, { gap = 900, fog = 2600, align = ['-18vw', '14vw', '-6vw', '20vw', '0vw'] } = {}) {
  const els = words.map((t, i) => {
    const e = document.createElement('div');
    e.className = 'df-word'; e.textContent = t;
    e.style.left = '50%';
    e.style.setProperty('--x', align[i % align.length]);
    stage.appendChild(e);
    return e;
  });
  const total = gap * (words.length + 1);
  return {
    els,
    update(p) {                       // p: 0..1
      const cam = p * total;
      els.forEach((e, i) => {
        const z = cam - gap * (i + 1);  // >0 means behind the camera
        if (z > 600 || z < -fog) { e.style.visibility = 'hidden'; return; }
        const a = z > 0 ? 1 - z / 600 : 1 + z / fog;   // fade at both ends
        e.style.visibility = 'visible';
        e.style.opacity = Math.max(0, Math.min(1, a)).toFixed(3);
        e.style.transform = `translate3d(calc(-50% + var(--x)), -50%, ${z.toFixed(1)}px)`;
      });
    },
  };
}

export function velocityStretch(el, getV, { k = 0.012, max = 0.35 } = {}) {
  let s = 0;
  return function tick() {             // call every frame
    const v = getV() || 0;
    s += (Math.max(-max, Math.min(max, v * k)) - s) * 0.18;  // eased
    el.style.transform = `scaleY(${(1 + Math.abs(s)).toFixed(3)}) skewY(${(s * -12).toFixed(2)}deg)`;
  };
}

export function tiltToPointer(el, max = 8) {
  let tx = 0, ty = 0, x = 0, y = 0;
  addEventListener('pointermove', e => {
    tx = (e.clientX / innerWidth - 0.5) * 2; ty = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
  addEventListener('deviceorientation', e => {
    if (e.gamma == null) return;
    tx = Math.max(-1, Math.min(1, e.gamma / 30)); ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
  }, { passive: true });
  return function tick() {
    x += (tx - x) * 0.08; y += (ty - y) * 0.08;
    el.style.transform = `rotateY(${(x * max).toFixed(2)}deg) rotateX(${(-y * max).toFixed(2)}deg)`;
  };
}
