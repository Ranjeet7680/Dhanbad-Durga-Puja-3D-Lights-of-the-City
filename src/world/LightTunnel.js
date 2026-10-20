import * as THREE from 'three';

export class LightTunnel {
  constructor(scene, festivalClock) {
    this.scene = scene;
    this.festivalClock = festivalClock;
    this.group = new THREE.Group();
    // Positioned along the path connecting Central Hub (z ~ 0) to Housing Colony Pandal (z ~ -62)
    this.group.position.set(0, 0, -16);
    this.scene.add(this.group);

    this.bulbs = [];
    this.archCount = 12;
    this.tunnelLength = 34;

    this.buildTunnel();
  }

  buildTunnel() {
    const archRadius = 4.8;
    const archHeight = 4.2;
    const archSpacing = this.tunnelLength / (this.archCount - 1);

    // Glowing LED material palette (warm gold, festival magenta, cyan, vermilion, lime)
    const colors = [0xFFD54F, 0xE040FB, 0x00E5FF, 0xFF1744, 0x76FF03];
    const ledMats = colors.map((col) => {
      const m = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 2.2,
        roughness: 0.15
      });
      this.festivalClock.registerEmissive(m);
      return m;
    });

    // Ornate gold-trimmed structural truss material
    const goldFrameMat = new THREE.MeshStandardMaterial({
      color: 0x8D6E63,
      metalness: 0.7,
      roughness: 0.3
    });

    const bulbGeo = new THREE.SphereGeometry(0.14, 8, 8);

    // Continuous Fabric Canopy over the tunnel (Crimson silk with gold trims)
    const canopyGeo = new THREE.CylinderGeometry(
      archRadius + 0.1,
      archRadius + 0.1,
      this.tunnelLength,
      24,
      1,
      true,
      0,
      Math.PI
    );
    canopyGeo.rotateZ(Math.PI / 2);
    canopyGeo.rotateX(Math.PI / 2);

    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x88121E,
      roughness: 0.7,
      side: THREE.DoubleSide
    });
    const canopyMesh = new THREE.Mesh(canopyGeo, canopyMat);
    canopyMesh.position.set(0, archHeight, -this.tunnelLength / 2);
    this.group.add(canopyMesh);

    for (let i = 0; i < this.archCount; i++) {
      const zPos = -i * archSpacing;
      const archGroup = new THREE.Group();
      archGroup.position.set(0, 0, zPos);

      // Semi-circular Arch Rib
      const curveGeo = new THREE.TorusGeometry(archRadius, 0.14, 8, 32, Math.PI);
      const curveMesh = new THREE.Mesh(curveGeo, goldFrameMat);
      curveMesh.rotation.z = Math.PI;
      curveMesh.position.y = archHeight;
      archGroup.add(curveMesh);

      // Left & Right Vertical Golden Carved Pillars
      const pillarGeo = new THREE.CylinderGeometry(0.2, 0.25, archHeight, 12);
      const leftPillar = new THREE.Mesh(pillarGeo, goldFrameMat);
      leftPillar.position.set(-archRadius, archHeight / 2, 0);
      archGroup.add(leftPillar);

      const rightPillar = new THREE.Mesh(pillarGeo, goldFrameMat);
      rightPillar.position.set(archRadius, archHeight / 2, 0);
      archGroup.add(rightPillar);

      // Pillar decorative base plinths
      const baseGeo = new THREE.BoxGeometry(0.7, 0.4, 0.7);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.8 });
      const leftBase = new THREE.Mesh(baseGeo, baseMat);
      leftBase.position.set(-archRadius, 0.2, 0);
      archGroup.add(leftBase);

      const rightBase = new THREE.Mesh(baseGeo, baseMat);
      rightBase.position.set(archRadius, 0.2, 0);
      archGroup.add(rightBase);

      // Decorative Scalloped Arch Header Toran
      const headerGeo = new THREE.BoxGeometry(archRadius * 1.9, 0.35, 0.12);
      const headerMesh = new THREE.Mesh(headerGeo, baseMat);
      headerMesh.position.set(0, archHeight + 0.2, 0);
      archGroup.add(headerMesh);

      // Strings of LED lights tracing the arch curve
      const bulbCountOnArch = 16;
      for (let j = 0; j <= bulbCountOnArch; j++) {
        const theta = (j / bulbCountOnArch) * Math.PI;
        const bx = Math.cos(theta) * archRadius;
        const by = Math.sin(theta) * archRadius + archHeight;

        const mat = ledMats[(i * 3 + j) % ledMats.length];
        const bulb = new THREE.Mesh(bulbGeo, mat);
        bulb.position.set(bx, by, 0);

        this.bulbs.push({
          mesh: bulb,
          phase: i * 0.5 + j * 0.25
        });

        archGroup.add(bulb);
      }

      // Warm interior point lights illuminating the carpet & walking visitors
      if (i % 3 === 1) {
        const tunnelLight = new THREE.PointLight(0xFFB300, 1.8, 12);
        tunnelLight.position.set(0, archHeight + 0.5, zPos);
        tunnelLight.userData.baseIntensity = 1.8;
        this.festivalClock.registerFestivalLight(tunnelLight);
        this.group.add(tunnelLight);
      }

      this.group.add(archGroup);
    }

    // Walking Path: Grand Red Velvet Carpet Runner with Gold Border
    const carpetGeo = new THREE.PlaneGeometry(archRadius * 1.5, this.tunnelLength + 4);
    const carpetMat = new THREE.MeshStandardMaterial({
      color: 0xB71C1C, // Rich Festive Red Velvet
      roughness: 0.85
    });
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.035, -this.tunnelLength / 2);
    carpet.receiveShadow = true;
    this.group.add(carpet);

    // Gold trim border on edges of carpet
    const borderMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.8, roughness: 0.3 });
    [-archRadius * 0.75, archRadius * 0.75].forEach((bx) => {
      const bStrip = new THREE.Mesh(
        new THREE.PlaneGeometry(0.25, this.tunnelLength + 4),
        borderMat
      );
      bStrip.rotation.x = -Math.PI / 2;
      bStrip.position.set(bx, 0.04, -this.tunnelLength / 2);
      this.group.add(bStrip);
    });
  }

  update(delta, time) {
    // Dynamic chasing light wave effect (Chandannagar light pattern)
    const wave = time * 6.0;
    for (let i = 0; i < this.bulbs.length; i++) {
      const b = this.bulbs[i];
      const intensity = 0.7 + 0.45 * Math.sin(wave - b.phase);
      b.mesh.scale.setScalar(intensity);
    }
  }
}
