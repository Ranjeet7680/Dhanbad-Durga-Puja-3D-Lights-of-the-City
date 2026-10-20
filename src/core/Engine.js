import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export class Engine {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );
    this.camera.position.set(0, 4.5, 12);

    // Renderer with High Dynamic Range & Soft Shadows
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.appendChild(this.renderer.domElement);

    // Atmospheric Height Fog
    this.scene.fog = new THREE.FogExp2(0x0a1020, 0.0075);

    // Unreal Engine 5 Style Post-Processing: Bloom & Tone Mapping
    this.initPostProcessing();

    // High precision timer
    this.lastTime = performance.now();
    this.updatables = [];

    // Resize listener
    window.addEventListener('resize', () => this.onWindowResize());
  }

  initPostProcessing() {
    const renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.72, // Calibrated bloom strength: avoids blinding flare blowout
      0.40, // radius
      0.86  // threshold: only bright emissive bulbs and flames trigger bloom
    );

    const outputPass = new OutputPass();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(outputPass);
  }

  addUpdatable(object) {
    this.updatables.push(object);
  }

  removeUpdatable(object) {
    const idx = this.updatables.indexOf(object);
    if (idx !== -1) {
      this.updatables.splice(idx, 1);
    }
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  start() {
    const loop = (now) => {
      requestAnimationFrame(loop);
      const delta = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;
      const time = now / 1000;

      for (let i = 0; i < this.updatables.length; i++) {
        if (this.updatables[i].update) {
          this.updatables[i].update(delta, time);
        }
      }

      this.composer.render();
    };

    requestAnimationFrame(loop);
  }
}
