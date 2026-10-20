import * as THREE from 'three';

export class LightTunnel {
  constructor(scene, festivalClock) {
    this.scene = scene;
    this.festivalClock = festivalClock;
    this.group = new THREE.Group();
    // Positioned along the path connecting Central Hub (z ~ 0) to Housing Colony Pandal (z ~ -55)
    this.group.position.set(0, 0, -18);
    this.scene.add(this.group);

    this.bulbs = [];
    this.archCount = 14;
    this.tunnelLength = 32;

    this.buildTunnel();
  }

  buildTunnel() {
    const archRadius = 4.2;
    const archSpacing = this.tunnelLength / (this.archCount - 1);

    // Glowing LED material palette
    const colors = [0xFFD54F, 0xE040FB, 0x00E5FF, 0xFF1744, 0x76FF03];
    const ledMats = colors.map((col) => {
      const m = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 2.0,
        roughness: 0.2
      });
      this.festivalClock.registerEmissive(m);
      return m;
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1A1A24,
      metalness: 0.8,
      roughness: 0.5
    });

    const bulbGeo = new THREE.SphereGeometry(0.12, 8, 8);

    for (let i = 0; i < this.archCount; i++) {
      const zPos = -i * archSpacing;
      const archGroup = new THREE.Group();
      archGroup.position.set(0, 0, zPos);

      // Semi-circular arch pipe
      const curveGeo = new THREE.TorusGeometry(archRadius, 0.08, 8, 24, Math.PI);
      const curveMesh = new THREE.Mesh(curveGeo, frameMat);
      curveMesh.rotation.z = Math.PI;
      curveMesh.position.y = 0;
      archGroup.add(curveMesh);

      // Vertical posts on both sides
      const postGeo = new THREE.CylinderGeometry(0.08, 0.08, archRadius, 8);
      const leftPost = new THREE.Mesh(postGeo, frameMat);
      leftPost.position.set(-archRadius, archRadius / 2, 0);
      archGroup.add(leftPost);

      const rightPost = new THREE.Mesh(postGeo, frameMat);
      rightPost.position.set(archRadius, archRadius / 2, 0);
      archGroup.add(rightPost);

      // Strings of LED lights along the arch curve
      const bulbCountOnArch = 18;
      for (let j = 0; j <= bulbCountOnArch; j++) {
        const theta = (j / bulbCountOnArch) * Math.PI;
        const bx = Math.cos(theta) * archRadius;
        const by = Math.sin(theta) * archRadius;

        const mat = ledMats[(i * 3 + j) % ledMats.length];
        const bulb = new THREE.Mesh(bulbGeo, mat);
        bulb.position.set(bx, by, 0);

        // Store reference for animation chase
        this.bulbs.push({
          mesh: bulb,
          baseScale: 1.0,
          phase: i * 0.4 + j * 0.2
        });

        archGroup.add(bulb);
      }

      // Add a couple of interior point lights for localized glow inside tunnel
      if (i % 4 === 2) {
        const tunnelLight = new THREE.PointLight(0xFFB300, 1.2, 8);
        tunnelLight.position.set(0, archRadius * 0.7, zPos);
        tunnelLight.userData.baseIntensity = 1.2;
        this.festivalClock.registerFestivalLight(tunnelLight);
        this.group.add(tunnelLight);
      }

      this.group.add(archGroup);
    }

    // Walking path carpet beneath the light tunnel
    const carpetGeo = new THREE.PlaneGeometry(archRadius * 1.6, this.tunnelLength + 2);
    const carpetMat = new THREE.MeshStandardMaterial({
      color: 0x991B1B,
      roughness: 0.9
    });
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.04, -this.tunnelLength / 2);
    carpet.receiveShadow = true;
    this.group.add(carpet);
  }

  update(delta, time) {
    // Dynamic chasing light wave effect
    const wave = time * 5;
    for (let i = 0; i < this.bulbs.length; i++) {
      const b = this.bulbs[i];
      const intensity = 0.6 + 0.5 * Math.sin(wave - b.phase);
      b.mesh.scale.setScalar(intensity);
    }
  }
}
