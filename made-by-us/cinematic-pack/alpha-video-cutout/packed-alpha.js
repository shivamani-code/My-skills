// Packed-alpha video compositor: one H.264 MP4 with colour on the LEFT half and a
// greyscale matte on the RIGHT half, drawn with real transparency in WebGL.
// Works in every browser that plays MP4 (Safari/iOS included). No deps.
//   const v = Object.assign(document.createElement('video'),
//     { src: 'person-packed.mp4', muted: true, loop: true, playsInline: true, autoplay: true });
//   const cut = packedAlpha(document.querySelector('#cutout'), v);  cut.start();
//   // scrub instead of play: v.pause(); cut.seek(progress)  (needs an all-intra encode, see SKILL.md)
export function packedAlpha(canvas, video, { maxDpr = 1.5 } = {}) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true });
  if (!gl) return null;
  const vs = `attribute vec2 p; varying vec2 uv; void main(){ uv = p*.5+.5; uv.y = 1.-uv.y; gl_Position = vec4(p,0.,1.); }`;
  const fs = `precision mediump float; varying vec2 uv; uniform sampler2D t;
    void main(){ vec3 c = texture2D(t, vec2(uv.x*.5, uv.y)).rgb;
      float a = texture2D(t, vec2(.5 + uv.x*.5, uv.y)).r;
      a = smoothstep(.04, .96, a);            // crush compression noise in the matte
      gl_FragColor = vec4(c * a, a); }`;      // premultiplied
  const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr); gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
  [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);   // NPOT-safe in WebGL1
  const resize = () => { const d = Math.min(devicePixelRatio || 1, maxDpr);
    canvas.width = canvas.clientWidth * d; canvas.height = canvas.clientHeight * d; gl.viewport(0, 0, canvas.width, canvas.height); };
  addEventListener('resize', resize, { passive: true }); resize();
  let raf = 0;
  const draw = () => {
    if (video.readyState >= 2) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  };
  // requestVideoFrameCallback uploads only when a new frame exists (Chrome, Safari 15.4+)
  const loop = () => { draw(); raf = video.requestVideoFrameCallback
    ? video.requestVideoFrameCallback(loop) : requestAnimationFrame(loop); };
  return {
    start() { video.play().catch(() => {}); loop(); },
    seek(p) { if (video.duration) { video.currentTime = p * video.duration; video.addEventListener('seeked', draw, { once: true }); } },
    draw,
  };
}
