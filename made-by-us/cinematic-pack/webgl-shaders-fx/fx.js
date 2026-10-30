// Tiny WebGL1 FX overlay: film grain, vignette, rising embers, burn/dissolve wipe, flash.
// One full-screen triangle, one fragment shader, rendered at reduced resolution.
//   import { createFX } from './fx.js';
//   const fx = createFX(document.querySelector('#fx'), { grain: .08, vignette: .55, embers: .7 });
//   fx.set({ burn: 0.4, flash: 0 });   // any uniform, any time
//   fx.start();                         // own rAF loop (or call fx.frame(t) yourself)
// The canvas sits on top: position:fixed; inset:0; pointer-events:none; mix-blend-mode:screen optional.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

const FRAG = `
precision mediump float;
uniform vec2 uRes; uniform float uTime;
uniform float uGrain, uVignette, uEmbers, uBurn, uFlash;
uniform vec3 uEmberColor;
float h(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+1.), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for(int i=0;i<4;i++){ v += a*n(p); p *= 2.03; a *= .5; } return v; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 asp = vec2(uRes.x / uRes.y, 1.);
  vec3 col = vec3(0.); float alpha = 0.;
  // embers: 3 layers of hashed cells drifting up, twinkling
  if (uEmbers > 0.) {
    for (int l = 0; l < 3; l++) {
      float fl = float(l);
      vec2 q = uv * asp * (6. + fl * 5.);
      q.y -= uTime * (.25 + fl * .12);
      q.x += sin(q.y * .7 + uTime * .5 + fl) * .3;
      vec2 id = floor(q), gv = fract(q) - .5;
      float r = h(id + fl * 7.);
      if (r > .82) {
        vec2 o = vec2(h(id + 3.1), h(id + 5.7)) - .5;
        float d = length(gv - o * .6);
        float tw = .6 + .4 * sin(uTime * (3. + r * 6.) + r * 40.);
        float e = smoothstep(.09 - fl * .02, 0., d) * tw * uEmbers;
        col += uEmberColor * e; alpha = max(alpha, e);
      }
    }
  }
  // burn wipe: fbm threshold eating the screen from the top down (use uv.y instead of 1.-uv.y to flip), thin glowing rim
  if (uBurn > 0.) {
    float t = fbm(uv * asp * 3.) * .6 + (1. - uv.y) * .7;
    float edge = uBurn * 1.4 - .1;
    float burnt = smoothstep(edge, edge - .03, t);
    float rim = smoothstep(.025, 0., abs(t - edge)) * step(.001, uBurn) * (1. - step(.999, uBurn));
    col = mix(col, vec3(0.), burnt); alpha = max(alpha, burnt);
    col += vec3(1., .42, .08) * rim * 1.6; alpha = max(alpha, rim);
  }
  // vignette (darkens via alpha on black)
  float v = smoothstep(.35, 1.05, length((uv - .5) * asp * 1.1)) * uVignette;
  alpha = max(alpha, v * (1. - alpha));
  // grain: animated, signed, added on top
  float g = (h(gl_FragCoord.xy + fract(uTime * 7.) * 300.) - .5) * uGrain;
  col += g; alpha = max(alpha, abs(g));
  col += uFlash; alpha = max(alpha, uFlash);
  gl_FragColor = vec4(col, clamp(alpha, 0., 1.));
}`;

export function createFX(canvas, init = {}) {
  const coarse = matchMedia('(pointer: coarse)').matches;
  const scale = init.scale ?? (coarse ? 0.5 : 0.75);       // render resolution vs CSS px
  const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, alpha: true });
  if (!gl) return { set() {}, start() {}, stop() {}, frame() {}, ok: false };
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o);
    if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(pr); gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const U = {}; ['uRes', 'uTime', 'uGrain', 'uVignette', 'uEmbers', 'uBurn', 'uFlash', 'uEmberColor']
    .forEach(k => U[k] = gl.getUniformLocation(pr, k));
  const state = Object.assign({ grain: 0.08, vignette: 0.5, embers: 0, burn: 0, flash: 0, emberColor: [1, 0.55, 0.2] }, init);
  const resize = () => {
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  addEventListener('resize', resize, { passive: true }); resize();
  let raf = 0;
  const frame = (ms) => {
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, ms / 1000);
    gl.uniform1f(U.uGrain, state.grain); gl.uniform1f(U.uVignette, state.vignette);
    gl.uniform1f(U.uEmbers, state.embers); gl.uniform1f(U.uBurn, state.burn); gl.uniform1f(U.uFlash, state.flash);
    gl.uniform3fv(U.uEmberColor, state.emberColor);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const loop = (t) => { frame(t); raf = requestAnimationFrame(loop); };
  return {
    ok: true, state, frame,
    set(o) { Object.assign(state, o); },
    start() { if (!raf) raf = requestAnimationFrame(loop); },
    stop() { cancelAnimationFrame(raf); raf = 0; },
  };
}
