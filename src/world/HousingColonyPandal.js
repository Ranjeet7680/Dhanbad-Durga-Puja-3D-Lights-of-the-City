import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';

export class HousingColonyPandal {
  constructor(scene, festivalClock) {
    this.scene = scene;
    this.festivalClock = festivalClock;
    this.group = new THREE.Group();
    // Positioned north of Central Hub beyond the Light Tunnel
    this.group.position.set(0, 0, -62);
    this.scene.add(this.group);

    this.flames = [];
    this.smokeParticles = [];

    this.buildStructure();
    this.buildFacadeDetails();
    this.buildSanctumAltar();
    this.buildQueueBarriers();
  }

  buildStructure() {
    // Grand Plinth / Base Platform
    const plinthGeo = new THREE.BoxGeometry(32, 1.2, 28);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x2A1810,
      roughness: 0.8
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = 0.6;
    plinth.receiveShadow = true;
    this.group.add(plinth);

    // Front Grand Steps
    const stepCount = 5;
    for (let s = 0; s < stepCount; s++) {
      const stepGeo = new THREE.BoxGeometry(16 - s * 0.4, 0.24, 0.8);
      const stepMat = new THREE.MeshStandardMaterial({ color: 0x8B2500, roughness: 0.7 });
      const step = new THREE.Mesh(stepGeo, stepMat);
      step.position.set(0, s * 0.24 + 0.12, 14.4 + (stepCount - s) * 0.8);
      step.receiveShadow = true;
      this.group.add(step);
    }

    // Main Hall Walls (Pandal Pavilion)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x991B1B, // Festive Crimson
      roughness: 0.6
    });

    // Left and Right Pavilion Walls
    const sideWallGeo = new THREE.BoxGeometry(1.2, 12, 26);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-15, 6.6, 0);
    this.group.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.position.set(15, 6.6, 0);
    this.group.add(rightWall);

    // Back Sanctum Wall
    const backWallGeo = new THREE.BoxGeometry(31.2, 12, 1.2);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 6.6, -13);
    this.group.add(backWall);

    // Stepped Multi-Tier Roofs (Traditional Bengal Chala style)
    const tier1Geo = new THREE.BoxGeometry(34, 1.8, 30);
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xFFB300, roughness: 0.4 });
    const tier1 = new THREE.Mesh(tier1Geo, goldTrimMat);
    tier1.position.set(0, 13.5, 0);
    this.group.add(tier1);

    const tier2Geo = new THREE.BoxGeometry(26, 2.4, 22);
    const crimsonRoofMat = new THREE.MeshStandardMaterial({ color: 0x7F1D1D, roughness: 0.5 });
    const tier2 = new THREE.Mesh(tier2Geo, crimsonRoofMat);
    tier2.position.set(0, 15.6, 0);
    this.group.add(tier2);

    const tier3Geo = new THREE.BoxGeometry(18, 3.2, 16);
    const tier3 = new THREE.Mesh(tier3Geo, goldTrimMat);
    tier3.position.set(0, 18.4, 0);
    this.group.add(tier3);

    // Pinnacle Spire & Golden Kalash
    const spireGeo = new THREE.ConeGeometry(3.5, 7, 8);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      metalness: 0.85,
      roughness: 0.15
    });
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.set(0, 23.5, 0);
    this.group.add(spire);

    // Interior Brocade Ceiling
    const ceilingTex = TextureGenerator.createBrocadeFabricTexture();
    const ceilingGeo = new THREE.PlaneGeometry(28, 24);
    const ceilingMat = new THREE.MeshStandardMaterial({ map: ceilingTex, roughness: 0.7 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 12.2, 0);
    this.group.add(ceiling);

    // Interior Alpona Floor
    const alponaTex = TextureGenerator.createAlponaTexture();
    const intFloorGeo = new THREE.PlaneGeometry(28, 24);
    const intFloorMat = new THREE.MeshStandardMaterial({ map: alponaTex, roughness: 0.7 });
    const intFloor = new THREE.Mesh(intFloorGeo, intFloorMat);
    intFloor.rotation.x = -Math.PI / 2;
    intFloor.position.set(0, 1.22, 0);
    intFloor.receiveShadow = true;
    this.group.add(intFloor);
  }

  buildFacadeDetails() {
    // Grand Front Arched Portico
    const porticoPillars = [-10, -5, 5, 10];
    const pillarGeo = new THREE.CylinderGeometry(0.7, 0.8, 12, 16);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xFFE082, roughness: 0.3 });

    porticoPillars.forEach((px) => {
      const p = new THREE.Mesh(pillarGeo, pillarMat);
      p.position.set(px, 6.6, 13.5);
      p.castShadow = true;
      this.group.add(p);
    });

    // Pandal Banner Signboard
    const signTex = TextureGenerator.createSignboardTexture(
      'धनबाद हाउसिंग कॉलोनी दुर्गोत्सव',
      'Dhanbad Housing Colony Sarbojanin Durga Puja • 2026',
      'gold'
    );
    const signGeo = new THREE.PlaneGeometry(16, 3.2);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 12.8, 14.2);
    this.group.add(sign);

    // Golden Chandelier inside
    const chandelier = new THREE.Group();
    chandelier.position.set(0, 10.5, 0);

    const ringGeo = new THREE.TorusGeometry(3.2, 0.15, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.9, roughness: 0.2 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    chandelier.add(ring);

    // Hanging warm chandelier lights
    for (let c = 0; c < 12; c++) {
      const angle = (c * Math.PI * 2) / 12;
      const bulbGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const bulbMat = new THREE.MeshStandardMaterial({
        color: 0xFFE082,
        emissive: 0xFFA000,
        emissiveIntensity: 2.0
      });
      this.festivalClock.registerEmissive(bulbMat);
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(Math.cos(angle) * 3.2, -0.4, Math.sin(angle) * 3.2);
      chandelier.add(bulb);
    }

    const chandelierLight = new THREE.PointLight(0xFFB300, 2.5, 25);
    chandelierLight.position.set(0, -0.5, 0);
    chandelierLight.userData.baseIntensity = 2.5;
    this.festivalClock.registerFestivalLight(chandelierLight);
    chandelier.add(chandelierLight);

    this.group.add(chandelier);
  }

  buildSanctumAltar() {
    const altar = new THREE.Group();
    altar.position.set(0, 1.2, -9);

    // Elevated Altar Dais
    const daisGeo = new THREE.BoxGeometry(14, 1.2, 6);
    const daisMat = new THREE.MeshStandardMaterial({ color: 0xB71C1C, roughness: 0.6 });
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.y = 0.6;
    altar.add(dais);

    // Ornate Golden Backing (Chalchitra / Halo Arch)
    const haloGeo = new THREE.CylinderGeometry(5.5, 5.5, 0.4, 32, 1, false, 0, Math.PI);
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      metalness: 0.8,
      roughness: 0.2
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.z = -Math.PI / 2;
    halo.rotation.y = Math.PI / 2;
    halo.position.set(0, 5.6, -1.8);
    altar.add(halo);

    // Respectful Illuminated Pratima Tableau (Stylized Devotional Golden Silhouette)
    const pratimaGroup = new THREE.Group();
    pratimaGroup.position.set(0, 1.2, 0);

    // Central Maa Durga Silhouette Figure
    const idolMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0xFF8F00,
      emissiveIntensity: 0.6
    });
    this.festivalClock.registerEmissive(idolMat);

    // Body
    const torsoGeo = new THREE.CylinderGeometry(0.5, 0.8, 2.8, 12);
    const torso = new THREE.Mesh(torsoGeo, idolMat);
    torso.position.y = 3.6;
    pratimaGroup.add(torso);

    // Crown (Mukut)
    const crownGeo = new THREE.ConeGeometry(0.7, 1.4, 8);
    const crown = new THREE.Mesh(crownGeo, idolMat);
    crown.position.y = 5.7;
    pratimaGroup.add(crown);

    // Lion Vahana base
    const lionGeo = new THREE.BoxGeometry(2.4, 1.4, 3.2);
    const lion = new THREE.Mesh(lionGeo, idolMat);
    lion.position.set(0, 1.0, 0.2);
    pratimaGroup.add(lion);

    // Symbolic Radiant Trishul (Trident)
    const trishulPole = new THREE.CylinderGeometry(0.06, 0.06, 4.8, 8);
    const trishul = new THREE.Mesh(trishulPole, idolMat);
    trishul.position.set(0.9, 4.2, 0.8);
    trishul.rotation.z = -0.2;
    pratimaGroup.add(trishul);

    // Flanking deities (Lakshmi, Saraswati, Ganesha, Kartikeya icons)
    const flankOffsets = [-4.5, -2.4, 2.4, 4.5];
    flankOffsets.forEach((fx) => {
      const flankFig = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 2.2, 8), idolMat);
      flankFig.position.set(fx, 2.8, 0.2);
      pratimaGroup.add(flankFig);
    });

    altar.add(pratimaGroup);

    // Brass Diyas (Oil lamps) with flickering flame
    const diyaPositions = [-5, -3, -1, 1, 3, 5];
    const diyaMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.9, roughness: 0.1 });
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xFFB74D });

    diyaPositions.forEach((dx) => {
      const diya = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.15, 0.18, 12), diyaMat);
      diya.position.set(dx, 1.25, 2.2);
      altar.add(diya);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.24, 6), flameMat);
      flame.position.set(dx, 1.45, 2.2);
      altar.add(flame);
      this.flames.push(flame);
    });

    // Devotional Sanctum Spotlight
    const sanctumSpot = new THREE.SpotLight(0xFFE082, 3.5, 24, Math.PI / 4, 0.4);
    sanctumSpot.position.set(0, 11, -2);
    sanctumSpot.target = dais;
    sanctumSpot.userData.baseIntensity = 3.5;
    this.festivalClock.registerFestivalLight(sanctumSpot);
    altar.add(sanctumSpot);

    // Procedural Incense Smoke Particle System (Dhoonuchi smoke)
    this.createIncenseSmoke(altar);

    this.group.add(altar);
  }

  createIncenseSmoke(parent) {
    const smokeCount = 30;
    const smokeGeo = new THREE.SphereGeometry(0.18, 6, 6);
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0xE0E0E0,
      transparent: true,
      opacity: 0.35
    });

    for (let i = 0; i < smokeCount; i++) {
      const particle = new THREE.Mesh(smokeGeo, smokeMat);
      particle.position.set(
        (Math.random() - 0.5) * 1.5,
        1.5 + Math.random() * 4.0,
        1.2 + (Math.random() - 0.5) * 1.5
      );
      particle.userData = {
        speedY: 0.6 + Math.random() * 0.8,
        swaySpeed: 1.5 + Math.random() * 2.0,
        swayOffset: Math.random() * Math.PI * 2,
        initialY: 1.5,
        maxY: 6.5
      };
      parent.add(particle);
      this.smokeParticles.push(particle);
    }
  }

  buildQueueBarriers() {
    // Elegant brass queue stanchions for visitor walkway
    const railMat = new THREE.MeshStandardMaterial({ color: 0xFFB300, metalness: 0.8, roughness: 0.3 });
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0x991B1B, roughness: 0.9 });

    for (let z = 2; z <= 12; z += 3) {
      [-3.5, 3.5].forEach((rx) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.1, 8), railMat);
        post.position.set(rx, 1.75, z);
        this.group.add(post);
      });
    }
  }

  update(delta, time) {
    // Diya flame flicker
    for (let i = 0; i < this.flames.length; i++) {
      const f = this.flames[i];
      const s = 0.85 + 0.3 * Math.sin(time * 12 + i * 2);
      f.scale.set(s, s * (1 + 0.2 * Math.cos(time * 15)), s);
    }

    // Incense smoke upward drift
    for (let i = 0; i < this.smokeParticles.length; i++) {
      const p = this.smokeParticles[i];
      p.position.y += p.userData.speedY * delta;
      p.position.x += Math.sin(time * p.userData.swaySpeed + p.userData.swayOffset) * delta * 0.3;
      p.scale.addScalar(delta * 0.3);

      if (p.position.y > p.userData.maxY) {
        p.position.y = p.userData.initialY;
        p.position.x = (Math.random() - 0.5) * 1.2;
        p.scale.set(1, 1, 1);
      }
    }
  }
}
