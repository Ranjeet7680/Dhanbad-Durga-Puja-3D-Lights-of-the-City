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
    // Large hemisphere sky dome with custom vertex colors for horizon twilight gradient
    const skyGeo = new THREE.SphereGeometry(600, 32, 24);
    const count = skyGeo.attributes.position.count;
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const y = skyGeo.attributes.position.getY(i);
      // Normalized elevation [0 = horizon, 1 = zenith]
      const h = Math.max(0, Math.min(1, y / 500));
      
      // Zenith: deep midnight indigo (0.02, 0.05, 0.12)
      // Horizon: twilight amber/dusk (0.45, 0.18, 0.1)
      const r = 0.02 * h + 0.35 * (1 - h);
      const g = 0.05 * h + 0.14 * (1 - h);
      const b = 0.14 * h + 0.18 * (1 - h);

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
    const starCount = 1400;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Distribute on upper hemisphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0) * 0.5; // only top half
      const radius = 540 + Math.random() * 20;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) + 40; // keep above ground
      const z = radius * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation: warm gold, bright white, soft cyan
      const pType = Math.random();
      if (pType > 0.8) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 0.5; // Gold
      } else if (pType > 0.6) {
        starColors[i * 3] = 0.6; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 1.0;  // Cyan
      } else {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0;  // White
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      fog: false
    });

    this.stars = new THREE.Points(starGeo, starMat);
    this.group.add(this.stars);
  }

  initMoon() {
    // Glowing crescent festival moon in distance
    const moonGroup = new THREE.Group();
    moonGroup.position.set(220, 280, -320);

    const moonGeo = new THREE.SphereGeometry(18, 16, 16);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xFFF9C4,
      fog: false
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moon);

    // Soft moon aura glow
    const haloGeo = new THREE.PlaneGeometry(80, 80);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 249, 196, 0.65)');
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
    // 3 Volumetric Sweeping Sky Searchlight Beams
    const origins = [
      { x: -10, y: 15, z: -75, color: 0x80D8FF, speed: 0.8, offset: 0 },       // Behind Housing Colony
      { x: 45,  y: 20, z: -15, color: 0xFFD54F, speed: 0.6, offset: Math.PI / 3 }, // At Mega Mela
      { x: 60,  y: 18, z: 10,  color: 0xE040FB, speed: 0.75, offset: Math.PI }      // South Mela
    ];

    origins.forEach((o) => {
      const beamGroup = new THREE.Group();
      beamGroup.position.set(o.x, o.y, o.z);

      // Long semi-transparent conical beam
      const beamGeo = new THREE.CylinderGeometry(0.8, 18, 220, 16, 1, true);
      beamGeo.translate(0, 110, 0); // Origin at base
      beamGeo.rotateX(Math.PI / 2);

      const beamMat = new THREE.MeshBasicMaterial({
        color: o.color,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamGroup.add(beamMesh);

      // Light beam spotlight
      const spot = new THREE.SpotLight(o.color, 4.0, 300, Math.PI / 8, 0.8);
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
    // Rotate sweeping sky searchlight beams
    for (let i = 0; i < this.searchlights.length; i++) {
      const sl = this.searchlights[i];
      const pitch = 0.75 + Math.sin(time * sl.speed + sl.offset) * 0.28;
      const yaw = Math.cos(time * (sl.speed * 0.7) + sl.offset) * 0.65;

      sl.group.rotation.x = -pitch;
      sl.group.rotation.y = yaw;
    }

    // Subtle starfield twinkling
    if (this.stars) {
      this.stars.material.opacity = 0.75 + Math.sin(time * 2.5) * 0.15;
    }
  }
}
