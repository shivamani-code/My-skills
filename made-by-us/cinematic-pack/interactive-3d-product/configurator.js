// Minimal product configurator on top of threejs-scenes/hero-scene.js conventions.
// Drag/touch to orbit (damped), swatches change material colour with a tween, hotspots pinned to 3D points.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function configurator({ renderer, scene, camera, model, swatchEls = [], hotspots = [] }) {
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.08, enablePan: false,
    minDistance: 2.5, maxDistance: 7, minPolarAngle: Math.PI * 0.2, maxPolarAngle: Math.PI * 0.55,
    autoRotate: true, autoRotateSpeed: 0.6 });
  controls.addEventListener('start', () => controls.autoRotate = false);   // user takes over

  // material to recolour: first mesh whose material name contains "body", else the first mesh
  let target = null;
  model.traverse(o => { if (o.isMesh && (!target || /body/i.test(o.material.name))) target = o; });
  const to = new THREE.Color();
  swatchEls.forEach(el => el.addEventListener('click', () => {
    to.set(el.dataset.color);
    swatchEls.forEach(s => s.setAttribute('aria-pressed', s === el));
  }));

  // hotspots: [{ el, position: [x,y,z] }] -> positioned each frame, hidden when behind the model
  const v = new THREE.Vector3();
  const tick = () => {
    controls.update();
    if (target && to.getHex() !== 0) target.material.color.lerp(to, 0.12);
    const r = renderer.domElement.getBoundingClientRect();
    hotspots.forEach(h => {
      v.fromArray(h.position).applyMatrix4(model.matrixWorld).project(camera);
      const facing = v.z < 1;
      h.el.style.transform = `translate(${(v.x * .5 + .5) * r.width}px, ${(-v.y * .5 + .5) * r.height}px)`;
      h.el.style.opacity = facing ? 1 : 0;
    });
  };
  return { controls, tick };
}
