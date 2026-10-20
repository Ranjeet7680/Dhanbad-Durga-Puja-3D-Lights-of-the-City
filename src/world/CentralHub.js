import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';

export class CentralHub {
  constructor(scene, festivalClock) {
    this.scene = scene;
    this.festivalClock = festivalClock;
    this.group = new THREE.Group();
    this.group.position.set(0, 0, 0);
    this.scene.add(this.group);

    this.lanternMaterials = [];

    this.buildPlaza();
    this.buildWelcomeToran();
    this.buildInfoKiosk();
    this.buildStreetLamps();
  }

  buildPlaza() {
    // Plaza circular Alpona floor
    const alponaTex = TextureGenerator.createAlponaTexture();
    const floorGeo = new THREE.CircleGeometry(16, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      map: alponaTex,
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.02;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Decorative perimeter stone curb
    const curbGeo = new THREE.RingGeometry(15.8, 16.5, 32);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xFFB300, roughness: 0.5 });
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.rotation.x = -Math.PI / 2;
    curb.position.y = 0.03;
    this.group.add(curb);
  }

  buildWelcomeToran() {
    const toranGroup = new THREE.Group();
    toranGroup.position.set(0, 0, 14);

    // Two Grand Pillars
    const pillarGeo = new THREE.BoxGeometry(1.6, 9, 1.6);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x8B1E1E,
      roughness: 0.6
    });

    const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
    leftPillar.position.set(-6, 4.5, 0);
    leftPillar.castShadow = true;
    toranGroup.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
    rightPillar.position.set(6, 4.5, 0);
    rightPillar.castShadow = true;
    toranGroup.add(rightPillar);

    // Pillar caps (Gold Kalash)
    const capGeo = new THREE.ConeGeometry(1.2, 1.8, 8);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      metalness: 0.8,
      roughness: 0.2
    });

    const leftCap = new THREE.Mesh(capGeo, goldMat);
    leftCap.position.set(-6, 9.9, 0);
    toranGroup.add(leftCap);

    const rightCap = new THREE.Mesh(capGeo, goldMat);
    rightCap.position.set(6, 9.9, 0);
    toranGroup.add(rightCap);

    // Main Arch Beam
    const archGeo = new THREE.BoxGeometry(14, 1.8, 1.2);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x6E1417,
      roughness: 0.5
    });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 8.5, 0);
    arch.castShadow = true;
    toranGroup.add(arch);

    // Welcome Banner Sign
    const signTex = TextureGenerator.createSignboardTexture(
      'स्वागतम् • DHANBAD DURGA PUJA',
      'Central Festival Hub • Lights of the City 2026',
      'gold'
    );
    const signGeo = new THREE.PlaneGeometry(10.5, 2.5);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex, transparent: true });
    
    // Front and Back signs
    const signFront = new THREE.Mesh(signGeo, signMat);
    signFront.position.set(0, 8.5, 0.65);
    toranGroup.add(signFront);

    const signBack = new THREE.Mesh(signGeo, signMat);
    signBack.position.set(0, 8.5, -0.65);
    signBack.rotation.y = Math.PI;
    toranGroup.add(signBack);

    // Hanging Marigold Toran Garlands
    const garlandGeo = new THREE.TorusGeometry(5, 0.2, 8, 24, Math.PI);
    const garlandTex = TextureGenerator.createMarigoldTexture();
    const garlandMat = new THREE.MeshStandardMaterial({
      map: garlandTex,
      roughness: 0.9
    });
    const garland = new THREE.Mesh(garlandGeo, garlandMat);
    garland.position.set(0, 7.5, 0);
    garland.rotation.z = Math.PI;
    toranGroup.add(garland);

    // Glowing Arch Lights
    for (let x = -5.5; x <= 5.5; x += 1.0) {
      const bulbGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const isAmber = Math.floor(x) % 2 === 0;
      const bulbMat = new THREE.MeshStandardMaterial({
        color: isAmber ? 0xFFC107 : 0xFF5722,
        emissive: isAmber ? 0xFFA000 : 0xE64A19,
        emissiveIntensity: 1.5,
        roughness: 0.2
      });
      this.festivalClock.registerEmissive(bulbMat);
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(x, 7.5, 0.65);
      toranGroup.add(bulb);
    }

    this.group.add(toranGroup);
  }

  buildInfoKiosk() {
    const kiosk = new THREE.Group();
    kiosk.position.set(8, 0, 4);

    // Wooden podium
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 1.2, 12);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.8 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.6;
    kiosk.add(base);

    // Canopy Roof
    const roofGeo = new THREE.ConeGeometry(2.4, 1.2, 6);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xFFB300, roughness: 0.4 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 3.6;
    kiosk.add(roof);

    // 4 Support posts
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8);
      const post = new THREE.Mesh(postGeo, baseMat);
      post.position.set(Math.cos(angle) * 1.3, 2.0, Math.sin(angle) * 1.3);
      kiosk.add(post);
    }

    // Map Board
    const boardTex = TextureGenerator.createSignboardTexture(
      'FESTIVAL DIRECTORY & MAP',
      'Housing Colony Pandal ➔ | 🪔 Mega Mela ➔',
      'blue'
    );
    const boardGeo = new THREE.PlaneGeometry(1.8, 1.2);
    const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 1.9, 0);
    board.rotation.y = -Math.PI / 4;
    kiosk.add(board);

    // Warm lamp inside kiosk
    const kioskLight = new THREE.PointLight(0xFFB74D, 1.2, 10);
    kioskLight.position.set(0, 2.8, 0);
    kioskLight.userData.baseIntensity = 1.2;
    this.festivalClock.registerFestivalLight(kioskLight);
    kiosk.add(kioskLight);

    this.group.add(kiosk);
  }

  buildStreetLamps() {
    const lampPositions = [
      [-10, 0, -8],
      [10, 0, -8],
      [-11, 0, 8],
      [11, 0, 8]
    ];

    lampPositions.forEach(([x, y, z]) => {
      const lamp = new THREE.Group();
      lamp.position.set(x, y, z);

      // Cast iron pole
      const poleGeo = new THREE.CylinderGeometry(0.12, 0.2, 5.5, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x1F2421, metalness: 0.8, roughness: 0.4 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 2.75;
      pole.castShadow = true;
      lamp.add(pole);

      // Ornate Lantern Housing
      const lanternGeo = new THREE.OctahedronGeometry(0.45);
      const lanternMat = new THREE.MeshStandardMaterial({
        color: 0xFFE082,
        emissive: 0xFFA000,
        emissiveIntensity: 1.8,
        roughness: 0.1
      });
      this.festivalClock.registerEmissive(lanternMat);
      const lantern = new THREE.Mesh(lanternGeo, lanternMat);
      lantern.position.y = 5.6;
      lamp.add(lantern);

      // Point Light
      const pLight = new THREE.PointLight(0xFFB300, 1.4, 16);
      pLight.position.y = 5.6;
      pLight.castShadow = false;
      pLight.userData.baseIntensity = 1.4;
      this.festivalClock.registerFestivalLight(pLight);
      lamp.add(pLight);

      this.group.add(lamp);
    });
  }
}
