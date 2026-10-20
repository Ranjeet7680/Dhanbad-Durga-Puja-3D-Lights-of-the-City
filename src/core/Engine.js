import * as THREE from 'three';

export class Engine {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true // Allows screenshot capture for photo mode
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.appendChild(this.renderer.domElement);

    // Fog for atmospheric depth
    this.scene.fog = new THREE.FogExp2(0x0c1322, 0.008);

    // Clock
    this.clock = new THREE.Clock();
    this.updatables = [];

    // Resize listener
    window.addEventListener('resize', () => this.onWindowResize());
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
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  start() {
    const loop = () => {
      requestAnimationFrame(loop);
      const delta = Math.min(this.clock.getDelta(), 0.1);
      const time = this.clock.getElapsedTime();

      for (let i = 0; i < this.updatables.length; i++) {
        if (this.updatables[i].update) {
          this.updatables[i].update(delta, time);
        }
      }

      this.renderer.render(this.scene, this.camera);
    };

    requestAnimationFrame(loop);
  }
}
