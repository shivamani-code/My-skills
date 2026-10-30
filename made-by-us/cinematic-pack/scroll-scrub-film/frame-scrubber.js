// FrameScrubber: scroll-scrubbed film on <canvas>. No dependencies. ES module.
// Original engine for the cinematic pack. Loads coarse-to-fine, blends neighbours
// (so you can ship half the frames), caps DPR, and never blocks on the network.
//
//   import { FrameScrubber } from './frame-scrubber.js';
//   const film = new FrameScrubber({ canvas, count: 72,
//     src: i => `frames/m/f_${String(i + 1).padStart(4, '0')}.webp` });
//   film.load();                         // fire and forget
//   onScroll(p => film.progress = p);    // 0..1 from ScrollTrigger / your own math
//   (function loop(){ film.render(); requestAnimationFrame(loop); })();

const mobile = matchMedia('(pointer: coarse)').matches || (navigator.deviceMemory || 8) <= 4;

export class FrameScrubber {
  constructor(opts) {
    Object.assign(this, {
      passes: [12, 4, 1],      // load every 12th frame, then every 4th, then all
      blend: true,             // cross-fade between the two nearest loaded frames
      maxDpr: mobile ? 1.5 : 2,
      fit: 'cover',            // or 'contain'
      concurrency: mobile ? 4 : 8,
      bitmaps: !mobile,        // ImageBitmap = smoother draws but pins decoded RAM
      onProgress: null,        // (loadedFraction) => {}
    }, opts);
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.frames = new Array(this.count).fill(null);
    this.loaded = 0; this.pos = -1; this.target = 0; this.dirty = true;
    this._resize = () => this.resize();
    addEventListener('resize', this._resize, { passive: true });
    this.resize();
  }

  resize() {
    const dpr = Math.min(devicePixelRatio || 1, this.maxDpr);
    const r = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, Math.round(r.width * dpr));
    this.canvas.height = Math.max(1, Math.round(r.height * dpr));
    this.dirty = true;
  }

  async load() {
    const order = [], seen = new Set();
    for (const step of this.passes)
      for (let i = 0; i < this.count; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
    for (let i = 0; i < this.count; i++) if (!seen.has(i)) order.push(i);
    let k = 0;
    const lane = async () => {
      while (k < order.length) {
        const i = order[k++];
        try { this.frames[i] = await this._fetch(this.src(i)); this.loaded++; this.dirty = true; }
        catch (e) { /* a missing frame is covered by its neighbours */ }
        this.onProgress && this.onProgress(this.loaded / this.count);
      }
    };
    await Promise.all(Array.from({ length: this.concurrency }, lane));
  }

  async _fetch(url) {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return this.bitmaps && 'createImageBitmap' in window ? createImageBitmap(img) : img;
  }

  set progress(p) { this.target = Math.min(1, Math.max(0, p)); }
  get progress() { return this.target; }

  _near(i, dir) {
    for (let j = i; j >= 0 && j < this.count; j += dir) if (this.frames[j]) return j;
    return -1;
  }

  // Call once per rAF. Draws only when the position or the loaded set changed.
  render() {
    const f = this.target * (this.count - 1);
    if (!this.dirty && Math.abs(f - this.pos) < 0.002) return false;
    let a = this._near(Math.floor(f), -1), b = this._near(Math.ceil(f), 1);
    if (a < 0) a = b; if (b < 0) b = a;
    if (a < 0) return false;                       // nothing loaded yet
    this.pos = f; this.dirty = false;
    this._draw(this.frames[a], 1);
    if (this.blend && b !== a) {
      const t = (f - a) / (b - a);
      if (t > 0.02) this._draw(this.frames[b], t);
    }
    return true;
  }

  _draw(img, alpha) {
    const { width: cw, height: ch } = this.canvas;
    const iw = img.width, ih = img.height;
    const s = this.fit === 'cover' ? Math.max(cw / iw, ch / ih) : Math.min(cw / iw, ch / ih);
    const w = iw * s, h = ih * s;
    this.ctx.globalAlpha = alpha;
    this.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    this.ctx.globalAlpha = 1;
  }

  destroy() {
    removeEventListener('resize', this._resize);
    this.frames.forEach(f => f && f.close && f.close());
    this.frames = [];
  }
}
