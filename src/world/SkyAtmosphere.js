import * as THREE from 'three';

export class SkyAtmosphere {
  constructor(scene, festivalClock) {
    this.scene = scene;
    this.festivalClock = festivalClock;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.searchlights = [];

    this.initSkyDome();
    this.initStarfield();
    this.initMoon();
    this.initSearchlightBeams();
  }

  initSkyDome() {
    // Large hemisphere sky dome with realistic atmospheric night sky gradient
    const skyGeo = new THREE.SphereGeometry(650, 32, 24);
    const count = skyGeo.attributes.position.count;
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const y = skyGeo.attributes.position.getY(i);
      const h = Math.max(0, Math.min(1, y / 550));
      
      // Zenith (Top): Deep midnight indigo (0.02, 0.04, 0.10)
      // Mid: Deep royal blue (0.06, 0.10, 0.20)
      // Horizon: Warm city night haze with soft festival amber (0.16, 0.10, 0.14)
      let r, g, b;
      if (h > 0.4) {
        const p = (h - 0.4) / 0.6;
        r = 0.02 * p + 0.06 * (1 - p);
        g = 0.04 * p + 0.10 * (1 - p);
        b = 0.10 * p + 0.20 * (1 - p);
      } else {
        const p = h / 0.4;
        r = 0.06 * p + 0.16 * (1 - p);
        g = 0.10 * p + 0.11 * (1 - p);
        b = 0.20 * p + 0.15 * (1 - p);
      }

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    skyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const skyMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      fog: false
    });

    this.skyDome = new THREE.Mesh(skyGeo, skyMat);
    this.group.add(this.skyDome);
  }

  initStarfield() {
    const starCount = 1500;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0) * 0.5;
      const radius = 580 + Math.random() * 30;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) + 30;
      const z = radius * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation: warm gold, bright white, soft cyan
      const pType = Math.random();
      if (pType > 0.8) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.88; starColors[i * 3 + 2] = 0.55;
      } else if (pType > 0.6) {
        starColors[i * 3] = 0.7; starColors[i * 3 + 1] = 0.92; starColors[i * 3 + 2] = 1.0;
      } else {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      fog: false
    });

    this.stars = new THREE.Points(starGeo, starMat);
    this.group.add(this.stars);
  }

  initMoon() {
    const moonGroup = new THREE.Group();
    moonGroup.position.set(220, 290, -340);

    const moonGeo = new THREE.SphereGeometry(16, 16, 16);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xFFF9C4,
      fog: false
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moon);

    // Soft moon aura glow
    const haloGeo = new THREE.PlaneGeometry(85, 85);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 249, 196, 0.7)');
    grad.addColorStop(0.4, 'rgba(255, 179, 0, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const haloTex = new THREE.CanvasTexture(canvas);
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.lookAt(0, 0, 0);
    moonGroup.add(halo);

    this.group.add(moonGroup);
  }

  initSearchlightBeams() {
    const origins = [
      { x: -12, y: 16, z: -80, color: 0x80D8FF, speed: 0.75, offset: 0 },
      { x: 45,  y: 22, z: -15, color: 0xFFD54F, speed: 0.55, offset: Math.PI / 3 },
      { x: 62,  y: 19, z: 12,  color: 0xE040FB, speed: 0.7,  offset: Math.PI }
    ];

    origins.forEach((o) => {
      const beamGroup = new THREE.Group();
      beamGroup.position.set(o.x, o.y, o.z);

      const beamGeo = new THREE.CylinderGeometry(0.8, 20, 240, 16, 1, true);
      beamGeo.translate(0, 120, 0);
      beamGeo.rotateX(Math.PI / 2);

      const beamMat = new THREE.MeshBasicMaterial({
        color: o.color,
        transparent: true,
        opacity: 0.24,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamGroup.add(beamMesh);

      const spot = new THREE.SpotLight(o.color, 4.5, 320, Math.PI / 7, 0.85);
      spot.position.set(0, 0, 0);
      beamGroup.add(spot);

      this.group.add(beamGroup);

      this.searchlights.push({
        group: beamGroup,
        speed: o.speed,
        offset: o.offset
      });
    });
  }

  update(delta, time) {
    for (let i = 0; i < this.searchlights.length; i++) {
      const sl = this.searchlights[i];
      const pitch = 0.75 + Math.sin(time * sl.speed + sl.offset) * 0.28;
      const yaw = Math.cos(time * (sl.speed * 0.7) + sl.offset) * 0.65;

      sl.group.rotation.x = -pitch;
      sl.group.rotation.y = yaw;
    }

    if (this.stars) {
      this.stars.material.opacity = 0.8 + Math.sin(time * 2.5) * 0.15;
    }
  }
}
