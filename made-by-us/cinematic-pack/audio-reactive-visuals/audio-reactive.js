// Audio-reactive driver: Web Audio analyser -> smoothed bass/mid/high/level values 0..1 every frame.
// Feed them into fx.js uniforms, CSS vars, or Three.js. Starts only after a user gesture (autoplay rules).
//   const ar = await audioReactive({ src: 'music.mp3' });   // inside a click handler
//   gsap.ticker.add(() => { const b = ar.read(); fx.set({ embers: .3 + b.bass * .7 });
//     document.documentElement.style.setProperty('--pulse', b.level); });
export async function audioReactive({ src, element, mic = false, smoothing = 0.8 } = {}) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  await ctx.resume();
  let node;
  if (mic) node = ctx.createMediaStreamSource(await navigator.mediaDevices.getUserMedia({ audio: true }));
  else {
    const el = element || Object.assign(new Audio(src), { crossOrigin: 'anonymous', loop: true });
    node = ctx.createMediaElementSource(el); node.connect(ctx.destination); el.play();
  }
  const an = ctx.createAnalyser(); an.fftSize = 512; an.smoothingTimeConstant = smoothing;
  node.connect(an);
  const bins = new Uint8Array(an.frequencyBinCount), hz = ctx.sampleRate / an.fftSize;
  const band = (lo, hi) => { let s = 0, n = 0; for (let i = Math.floor(lo / hz); i <= Math.min(bins.length - 1, hi / hz); i++) { s += bins[i]; n++; } return n ? s / n / 255 : 0; };
  const out = { bass: 0, mid: 0, high: 0, level: 0, beat: false };
  let avg = 0;
  return {
    ctx, analyser: an,
    read() {
      an.getByteFrequencyData(bins);
      const b = band(20, 150), m = band(150, 2000), h = band(2000, 10000);
      out.bass += (b - out.bass) * 0.5; out.mid += (m - out.mid) * 0.3; out.high += (h - out.high) * 0.3;
      out.level = (out.bass * 2 + out.mid + out.high) / 4;
      out.beat = b > avg * 1.35 && b > 0.35; avg = avg * 0.95 + b * 0.05;   // simple onset
      return out;
    },
    close() { ctx.close(); },
  };
}
