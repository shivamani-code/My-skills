// Vanilla Three.js hero scene with perf tiers, GLTF loading (Draco + meshopt), cheap bloom-ish glow, and scroll hook.
// <script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js",
//   "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"}}</script>
import * as THREE from 'three';

export function tier() {
  const mem = navigator.deviceMemory || 4, cores = navigator.hardwareConcurrency || 4;
  const coarse = matchMedia('(pointer: coarse)').matches;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;   // static poster
  if (coarse || mem <= 4 || cores <= 4) return 1;  // phones (Chrome caps deviceMemory at 8, so don't trust it): no post, dpr 1.25
  return 2;                                                               // desktop: post FX, dpr 2
}

export async function heroScene(canvas, { gltfUrl, onProgress } = {}) {
  const T = tier();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: T === 2, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, T === 2 ? 2 : 1.25));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060a, 0.08);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.4, 6);

  scene.add(new THREE.HemisphereLight(0x8899ff, 0x110800, 0.6));
  const key = new THREE.DirectionalLight(0xffb070, 2.2); key.position.set(3, 4, 2); scene.add(key);

  let model;
  if (gltfUrl) {
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');
    const draco = new DRACOLoader().setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/');
    const { MeshoptDecoder } = await import('three/addons/libs/meshopt_decoder.module.js');
    const gltf = await new GLTFLoader().setDRACOLoader(draco).setMeshoptDecoder(MeshoptDecoder).loadAsync(gltfUrl, e => onProgress?.(e.loaded / (e.total || 1)));
    model = gltf.scene;
    // normalise any model to ~2.4 units, centred, so camera/fog values always work
    const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()).length();
    model.scale.setScalar(2.4 / size);
    model.position.sub(box.getCenter(new THREE.Vector3()).multiplyScalar(2.4 / size));
  } else {                                     // procedural placeholder: glowing torus "portal"
    model = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.06, 24, T === 2 ? 200 : 96),
      new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0xff7a2a, emissiveIntensity: 2.5, roughness: .4 }));
  }
  scene.add(model);

  // Cheap glow for phones: an additive sprite instead of a bloom pass
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xff8a3d, transparent: true, opacity: .35,
    blending: THREE.AdditiveBlending, depthWrite: false, map: radialTexture() }));
  glow.scale.set(5, 5, 1); scene.add(glow);

  let composer = null;
  if (T === 2) {                               // real bloom only on desktop tier
    const { EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js');
    const { RenderPass } = await import('three/addons/postprocessing/RenderPass.js');
    const { UnrealBloomPass } = await import('three/addons/postprocessing/UnrealBloomPass.js');
    const { OutputPass } = await import('three/addons/postprocessing/OutputPass.js');
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(256, 256), 0.8, 0.4, 0.2));
    composer.addPass(new OutputPass());
  }

  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); composer?.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  addEventListener('resize', resize, { passive: true }); resize();

  let progress = 0, visible = true;
  new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(canvas);
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    if (!visible) return;                       // zero GPU when off-screen
    const t = clock.getElapsedTime();
    model.rotation.y = t * 0.2 + progress * Math.PI;
    camera.position.z = 6 - progress * 3.5;
    composer ? composer.render() : renderer.render(scene, camera);
  });
  return { tier: T, scene, camera, renderer, model, set progress(p) { progress = p; },
    dispose() { renderer.setAnimationLoop(null); renderer.dispose(); } };
}

function radialTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
