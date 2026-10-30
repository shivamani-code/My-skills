// Drop-in GLSL pieces (WebGL1/2, mediump). Pair with fx.js or a Three.js ShaderMaterial.

// 1. Chromatic aberration (sample a texture three times, offset by velocity)
vec3 chroma(sampler2D t, vec2 uv, float amt){
  vec2 d = (uv - .5) * amt;
  return vec3(texture2D(t, uv + d).r, texture2D(t, uv).g, texture2D(t, uv - d).b);
}

// 2. Scroll/hover ripple distortion of an image
vec2 ripple(vec2 uv, vec2 center, float time, float strength){
  float d = distance(uv, center);
  return uv + normalize(uv - center + 1e-4) * sin(d * 40. - time * 6.) * strength * smoothstep(.5, 0., d);
}

// 3. Image dissolve between two textures via noise threshold (needs fbm from fx.js)
vec4 dissolve(sampler2D a, sampler2D b, vec2 uv, float p, float noise){
  float m = smoothstep(p - .05, p + .05, noise);
  vec4 c = mix(texture2D(b, uv), texture2D(a, uv), m);
  float rim = smoothstep(.06, 0., abs(noise - p));
  return c + vec4(1., .5, .15, 0.) * rim * 1.5;
}

// 4. Heat haze (vertical wobble, for fire / desert scenes)
vec2 haze(vec2 uv, float time){ return uv + vec2(sin(uv.y * 60. + time * 4.) * .002, 0.); }

// 5. Eclipse ring glow (procedural, no texture)
vec3 eclipse(vec2 uv, vec2 c, float r){
  float d = length(uv - c);
  float ring = smoothstep(r + .02, r, d) * smoothstep(r - .03, r, d);
  float halo = exp(-max(d - r, 0.) * 18.) * .8;
  return vec3(1., .55, .2) * (ring * 2. + halo) * step(r * .96, d);
}
