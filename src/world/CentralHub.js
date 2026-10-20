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
    this.fairyLights = [];
    this.flames = [];

    this.buildPlaza();
    this.buildWelcomeToran();
    this.buildInfoKiosk();
    this.buildStreetLamps();
    this.buildFestoonLights();
    this.buildDeepstambhLamps();
    this.buildPlantersAndKalash();
  }

  buildPlaza() {
    // Plaza circular Alpona floor
    const alponaTex = TextureGenerator.createAlponaTexture();
    const floorGeo = new THREE.CircleGeometry(16, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      map: alponaTex,
      roughness: 0.82,
      metalness: 0.08
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.02;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Decorative perimeter stone curb (terracotta & gold)
    const curbGeo = new THREE.RingGeometry(15.8, 16.8, 48);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xD97706, roughness: 0.6, metalness: 0.2 });
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.rotation.x = -Math.PI / 2;
    curb.position.y = 0.03;
    this.group.add(curb);

    // Outer concentric paved pedestrian ring
    const outerPavedGeo = new THREE.RingGeometry(16.8, 18.5, 48);
    const outerPavedMat = new THREE.MeshStandardMaterial({ color: 0x2A2421, roughness: 0.9 });
    const outerPaved = new THREE.Mesh(outerPavedGeo, outerPavedMat);
    outerPaved.rotation.x = -Math.PI / 2;
    outerPaved.position.y = 0.025;
    this.group.add(outerPaved);
  }

  buildWelcomeToran() {
    const toranGroup = new THREE.Group();
    toranGroup.position.set(0, 0, 14);

    // Two Grand Pillars (Crimson with gold fluting)
    const pillarGeo = new THREE.BoxGeometry(1.6, 9.5, 1.6);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x8B1E1E,
      roughness: 0.55
    });

    const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
    leftPillar.position.set(-6, 4.75, 0);
    leftPillar.castShadow = true;
    toranGroup.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
    rightPillar.position.set(6, 4.75, 0);
    rightPillar.castShadow = true;
    toranGroup.add(rightPillar);

    // Gold Fluted Trim on Pillars
    const trimGeo = new THREE.BoxGeometry(1.8, 0.3, 1.8);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      metalness: 0.8,
      roughness: 0.25
    });

    [-1.5, 4.75, 9.3].forEach(y => {
      const tL = new THREE.Mesh(trimGeo, goldMat);
      tL.position.set(-6, y + 0.15, 0);
      toranGroup.add(tL);
      const tR = new THREE.Mesh(trimGeo, goldMat);
      tR.position.set(6, y + 0.15, 0);
      toranGroup.add(tR);
    });

    // Pillar caps (Gold Kalash)
    const capGeo = new THREE.ConeGeometry(1.2, 1.8, 12);
    const leftCap = new THREE.Mesh(capGeo, goldMat);
    leftCap.position.set(-6, 10.4, 0);
    toranGroup.add(leftCap);

    const rightCap = new THREE.Mesh(capGeo, goldMat);
    rightCap.position.set(6, 10.4, 0);
    toranGroup.add(rightCap);

    // Main Arch Beam
    const archGeo = new THREE.BoxGeometry(14.5, 2.0, 1.4);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x6E1417,
      roughness: 0.5
    });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 9.0, 0);
    arch.castShadow = true;
    toranGroup.add(arch);

    // Welcome Banner Sign (Bilingual authentic Durga Puja committee sign)
    const signTex = TextureGenerator.createPujaBannerTexture(
      'श्री श्री दुर्गा पूजा समिति, धनबाद • DHANBAD',
      'Central Festival Hub • Lights of the City 2026 • हार्दिक अभिनन्दन',
      '#8B1E1E'
    );
    const signGeo = new THREE.PlaneGeometry(12.0, 2.4);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex, transparent: true });

    const signFront = new THREE.Mesh(signGeo, signMat);
    signFront.position.set(0, 9.0, 0.75);
    toranGroup.add(signFront);

    const signBack = new THREE.Mesh(signGeo, signMat);
    signBack.position.set(0, 9.0, -0.75);
    signBack.rotation.y = Math.PI;
    toranGroup.add(signBack);

    // Hanging Marigold Toran Garlands
    const garlandGeo = new THREE.TorusGeometry(5.2, 0.22, 8, 32, Math.PI);
    const garlandTex = TextureGenerator.createMarigoldTexture();
    const garlandMat = new THREE.MeshStandardMaterial({
      map: garlandTex,
      roughness: 0.9
    });
    const garland = new THREE.Mesh(garlandGeo, garlandMat);
    garland.position.set(0, 7.8, 0);
    garland.rotation.z = Math.PI;
    toranGroup.add(garland);

    // Calibrated Arch Fairy Lights (Amber & Warm Ruby)
    for (let x = -5.8; x <= 5.8; x += 0.8) {
      const bulbGeo = new THREE.SphereGeometry(0.14, 10, 10);
      const isAmber = Math.floor(x * 2) % 2 === 0;
      const bulbMat = new THREE.MeshStandardMaterial({
        color: isAmber ? 0xFFC107 : 0xE64A19,
        emissive: isAmber ? 0xFFA000 : 0xD84315,
        emissiveIntensity: 0.95,
        roughness: 0.2
      });
      this.festivalClock.registerEmissive(bulbMat);
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(x, 7.8, 0.72);
      toranGroup.add(bulb);
    }

    this.group.add(toranGroup);
  }

  buildInfoKiosk() {
    const kiosk = new THREE.Group();
    kiosk.position.set(8.5, 0, 4.0);

    // Octagonal Stone & Wood Podium
    const baseGeo = new THREE.CylinderGeometry(1.7, 1.9, 0.9, 8);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.85 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.45;
    base.receiveShadow = true;
    kiosk.add(base);

    // Stepped Table Platform
    const counterGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.15, 8);
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x2A1810, roughness: 0.7 });
    const counter = new THREE.Mesh(counterGeo, counterMat);
    counter.position.y = 0.95;
    kiosk.add(counter);

    // Natural Cedarwood Canopy Roof (Darker, non-reflective wood to avoid glare)
    const roofGeo = new THREE.ConeGeometry(2.5, 1.4, 6);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x4E342E,
      roughness: 0.85,
      metalness: 0.05
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 3.6;
    kiosk.add(roof);

    // Gold Trim on Roof Eaves
    const eaveGeo = new THREE.RingGeometry(2.35, 2.55, 6);
    const eaveMat = new THREE.MeshStandardMaterial({ color: 0xD97706, roughness: 0.4, metalness: 0.6 });
    const eave = new THREE.Mesh(eaveGeo, eaveMat);
    eave.rotation.x = -Math.PI / 2;
    eave.position.y = 2.92;
    kiosk.add(eave);

    // 4 Support posts (Polished dark timber)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const postGeo = new THREE.CylinderGeometry(0.07, 0.07, 2.2, 8);
      const post = new THREE.Mesh(postGeo, baseMat);
      post.position.set(Math.cos(angle) * 1.35, 1.95, Math.sin(angle) * 1.35);
      kiosk.add(post);
    }

    // Map Board with Dual Direction Signage
    const boardTex = TextureGenerator.createSignboardTexture(
      'FESTIVAL DIRECTORY & MAP',
      'Housing Colony Pandal ➔ | 🪔 Mega Mela ➔',
      'blue'
    );
    const boardGeo = new THREE.PlaneGeometry(1.8, 1.1);
    const boardMat = new THREE.MeshBasicMaterial({ map: boardTex });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 1.85, 0);
    board.rotation.y = -Math.PI / 4;
    kiosk.add(board);

    // Brochure stacks & Marigold Puja Thali on counter
    const thaliGeo = new THREE.CylinderGeometry(0.3, 0.28, 0.04, 16);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.85, roughness: 0.2 });
    const thali = new THREE.Mesh(thaliGeo, brassMat);
    thali.position.set(0.7, 1.05, 0.6);
    kiosk.add(thali);

    // Downward Pendant Lampshade (Directs light onto the board rather than washing out roof)
    const shadeGeo = new THREE.ConeGeometry(0.35, 0.25, 12, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.5 });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.set(0, 2.65, 0);
    kiosk.add(shade);

    // Warm downward task light inside kiosk
    const kioskLight = new THREE.PointLight(0xFFB74D, 0.85, 7, 1.5);
    kioskLight.position.set(0, 2.45, 0);
    kioskLight.userData.baseIntensity = 0.85;
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

      // Fluted Cast-iron Pole (Charcoal black)
      const poleGeo = new THREE.CylinderGeometry(0.12, 0.22, 5.6, 12);
      const poleMat = new THREE.MeshStandardMaterial({
        color: 0x1A1C1E,
        metalness: 0.85,
        roughness: 0.35
      });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 2.8;
      pole.castShadow = true;
      lamp.add(pole);

      // Decorative Crossbar Arm (Traditional Indian Municipal Lamp style)
      const armGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8);
      const arm = new THREE.Mesh(armGeo, poleMat);
      arm.rotation.z = Math.PI / 2;
      arm.position.y = 4.8;
      lamp.add(arm);

      // Carriage Lantern Frame (Hexagonal cage)
      const cageMat = new THREE.MeshStandardMaterial({ color: 0x111315, metalness: 0.9, roughness: 0.2 });
      const capGeo = new THREE.ConeGeometry(0.42, 0.35, 6);
      const lanternCap = new THREE.Mesh(capGeo, cageMat);
      lanternCap.position.y = 6.0;
      lamp.add(lanternCap);

      const baseGeo = new THREE.ConeGeometry(0.35, 0.25, 6);
      const lanternBase = new THREE.Mesh(baseGeo, cageMat);
      lanternBase.rotation.x = Math.PI;
      lanternBase.position.y = 5.3;
      lamp.add(lanternBase);

      // Inner Frosted Warm Bulb (Controlled emissive, avoiding radioactive flare)
      const bulbGeo = new THREE.SphereGeometry(0.2, 12, 12);
      const bulbMat = new THREE.MeshStandardMaterial({
        color: 0xFFE082,
        emissive: 0xFFA000,
        emissiveIntensity: 0.9,
        roughness: 0.2
      });
      this.festivalClock.registerEmissive(bulbMat);
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.y = 5.65;
      lamp.add(bulb);

      // Calibrated Point Light
      const pLight = new THREE.PointLight(0xFFB300, 1.1, 14, 1.4);
      pLight.position.y = 5.65;
      pLight.userData.baseIntensity = 1.1;
      this.festivalClock.registerFestivalLight(pLight);
      lamp.add(pLight);

      this.group.add(lamp);
    });
  }

  buildFestoonLights() {
    // Criss-crossing overhead fairy festoon strings (Bunti Lights)
    // Connects lamp posts across the plaza in elegant drooping catenary arcs
    const festoonPairs = [
      { from: [-10, 5.6, -8], to: [10, 5.6, -8] },
      { from: [-11, 5.6, 8],  to: [11, 5.6, 8] },
      { from: [-10, 5.6, -8], to: [-11, 5.6, 8] },
      { from: [10, 5.6, -8],  to: [11, 5.6, 8] },
      { from: [-6, 9.0, 14],  to: [-11, 5.6, 8] },
      { from: [6, 9.0, 14],   to: [11, 5.6, 8] }
    ];

    const colors = [0xFFD54F, 0xFF1744, 0x00E5FF, 0x76FF03, 0xFF9100, 0xE040FB];

    festoonPairs.forEach((pair, pIdx) => {
      const p1 = new THREE.Vector3(...pair.from);
      const p2 = new THREE.Vector3(...pair.to);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y -= 1.1; // Gentle catenary sag

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(24);

      // Black wire
      const wireGeo = new THREE.BufferGeometry().setFromPoints(points);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x1A1A1A, linewidth: 2 });
      const wire = new THREE.Line(wireGeo, wireMat);
      this.group.add(wire);

      // Hanging LED nodes along curve
      for (let i = 1; i < points.length - 1; i += 2) {
        const pt = points[i];
        const col = colors[(pIdx * 3 + i) % colors.length];

        const bulbGeo = new THREE.SphereGeometry(0.12, 8, 8);
        const bulbMat = new THREE.MeshStandardMaterial({
          color: col,
          emissive: col,
          emissiveIntensity: 0.95,
          roughness: 0.2
        });
        this.festivalClock.registerEmissive(bulbMat);

        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.copy(pt);
        this.group.add(bulb);

        this.fairyLights.push({
          mesh: bulb,
          baseColor: col,
          offset: i * 0.4 + pIdx
        });
      }
    });
  }

  buildDeepstambhLamps() {
    // Traditional Indian Brass Deepstambh / Samai Pillars (Tiered oil diya towers)
    const positions = [
      [-4.0, 0, 11.5],
      [4.0, 0, 11.5],
      [5.5, 0, 4.0]
    ];

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.88,
      roughness: 0.22
    });

    positions.forEach(([x, y, z]) => {
      const deepstambh = new THREE.Group();
      deepstambh.position.set(x, y, z);

      // Stepped Octagonal Base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.35, 8), brassMat);
      base.position.y = 0.17;
      deepstambh.add(base);

      // Central Pillar Column
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 2.4, 12), brassMat);
      col.position.y = 1.35;
      deepstambh.add(col);

      // 4 Tiered Diya Plates with small flickering flames
      [0.8, 1.3, 1.8, 2.3].forEach((tierY, idx) => {
        const plateRadius = 0.42 - idx * 0.08;
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(plateRadius, plateRadius * 0.85, 0.04, 16), brassMat);
        plate.position.y = tierY;
        deepstambh.add(plate);

        // 4 Wick Flames per tier
        for (let w = 0; w < 4; w++) {
          const angle = (w * Math.PI) / 2;
          const flameGeo = new THREE.ConeGeometry(0.04, 0.1, 6);
          const flameMat = new THREE.MeshBasicMaterial({ color: 0xFFA000 });
          const flame = new THREE.Mesh(flameGeo, flameMat);
          flame.position.set(
            Math.cos(angle) * (plateRadius - 0.05),
            tierY + 0.06,
            Math.sin(angle) * (plateRadius - 0.05)
          );
          deepstambh.add(flame);
          this.flames.push(flame);
        }
      });

      // Kalash Finial Top
      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.28, 8), brassMat);
      finial.position.y = 2.6;
      deepstambh.add(finial);

      // Soft warm amber pool from the diyas
      const diyaLight = new THREE.PointLight(0xFF9800, 0.6, 5, 2);
      diyaLight.position.y = 1.8;
      diyaLight.userData.baseIntensity = 0.6;
      this.festivalClock.registerFestivalLight(diyaLight);
      deepstambh.add(diyaLight);

      this.group.add(deepstambh);
    });
  }

  buildPlantersAndKalash() {
    // Sacred Purna Kalash & Marigold Floral Pots around plaza perimeter
    const angles = [Math.PI / 6, (5 * Math.PI) / 6, (7 * Math.PI) / 6, (11 * Math.PI) / 6];
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.85, roughness: 0.25 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.8 });
    const potMat = new THREE.MeshStandardMaterial({ color: 0x8D4A2B, roughness: 0.9 }); // Terracotta

    angles.forEach(ang => {
      const r = 15.2;
      const x = Math.cos(ang) * r;
      const z = Math.sin(ang) * r;

      const potGroup = new THREE.Group();
      potGroup.position.set(x, 0, z);

      // Terracotta Urn
      const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.2, 0.6, 12), potMat);
      urn.position.y = 0.3;
      potGroup.add(urn);

      // Coconut Top
      const coconut = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshStandardMaterial({ color: 0x4E342E }));
      coconut.position.y = 0.65;
      potGroup.add(coconut);

      // Mango Leaves Ring (Amra Pallav)
      for (let l = 0; l < 5; l++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.24, 4), greenMat);
        const lAngle = (l * Math.PI * 2) / 5;
        leaf.position.set(Math.cos(lAngle) * 0.18, 0.58, Math.sin(lAngle) * 0.18);
        leaf.rotation.z = Math.cos(lAngle) * 0.5;
        leaf.rotation.x = Math.sin(lAngle) * 0.5;
        potGroup.add(leaf);
      }

      this.group.add(potGroup);
    });
  }

  update(delta, time) {
    // Subtle flame flicker
    for (let i = 0; i < this.flames.length; i++) {
      const f = this.flames[i];
      const s = 0.9 + Math.sin(time * 12 + i * 2) * 0.2;
      f.scale.set(s, s * 1.1, s);
    }

    // Gentle twinkle for overhead festoon bulbs
    for (let i = 0; i < this.fairyLights.length; i++) {
      const item = this.fairyLights[i];
      const t = Math.sin(time * 3 + item.offset);
      if (item.mesh.material) {
        item.mesh.material.emissiveIntensity = 0.75 + t * 0.35;
      }
    }
  }
}
