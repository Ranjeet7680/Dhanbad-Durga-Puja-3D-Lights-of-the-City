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
    this.facadeLights = [];

    this.buildStructure();
    this.buildFacadeDetails();
    this.buildSanctumAltar();
    this.buildQueueBarriers();
    this.buildEntranceDecorations();
  }

  buildStructure() {
    // Grand Plinth / Base Platform
    const plinthGeo = new THREE.BoxGeometry(36, 1.4, 32);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x22130C,
      roughness: 0.8
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = 0.7;
    plinth.receiveShadow = true;
    this.group.add(plinth);

    // Front Grand Steps with Red Velvet Runner
    const stepCount = 6;
    for (let s = 0; s < stepCount; s++) {
      const stepGeo = new THREE.BoxGeometry(18 - s * 0.4, 0.24, 0.85);
      const stepMat = new THREE.MeshStandardMaterial({ color: 0x6A1B0E, roughness: 0.7 });
      const step = new THREE.Mesh(stepGeo, stepMat);
      step.position.set(0, s * 0.24 + 0.12, 16.0 + (stepCount - s) * 0.85);
      step.receiveShadow = true;
      this.group.add(step);

      // Red carpet runner strip in center of steps
      const carpetGeo = new THREE.PlaneGeometry(8, 0.86);
      const carpetMat = new THREE.MeshStandardMaterial({ color: 0xB71C1C, roughness: 0.9 });
      const carpet = new THREE.Mesh(carpetGeo, carpetMat);
      carpet.rotation.x = -Math.PI / 2;
      carpet.position.set(0, s * 0.24 + 0.25, 16.0 + (stepCount - s) * 0.85);
      this.group.add(carpet);
    }

    // Main Hall Walls (Pandal Pavilion)
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x881313, // Festive Crimson Silk
      roughness: 0.6
    });

    // Left and Right Pavilion Walls
    const sideWallGeo = new THREE.BoxGeometry(1.2, 14, 28);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-17, 7.7, 0);
    this.group.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.position.set(17, 7.7, 0);
    this.group.add(rightWall);

    // Back Sanctum Wall
    const backWallGeo = new THREE.BoxGeometry(34.5, 14, 1.2);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 7.7, -14);
    this.group.add(backWall);

    // Stepped Multi-Tier Roofs (Traditional Bengal Chala style)
    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xFFB300,
      metalness: 0.65,
      roughness: 0.25
    });
    this.festivalClock.registerEmissive(goldTrimMat);

    const tier1Geo = new THREE.BoxGeometry(38, 2.0, 34);
    const tier1 = new THREE.Mesh(tier1Geo, goldTrimMat);
    tier1.position.set(0, 15.0, 0);
    this.group.add(tier1);

    const crimsonRoofMat = new THREE.MeshStandardMaterial({ color: 0x6E1010, roughness: 0.5 });
    const tier2Geo = new THREE.BoxGeometry(28, 2.8, 24);
    const tier2 = new THREE.Mesh(tier2Geo, crimsonRoofMat);
    tier2.position.set(0, 17.4, 0);
    this.group.add(tier2);

    const tier3Geo = new THREE.BoxGeometry(20, 3.4, 18);
    const tier3 = new THREE.Mesh(tier3Geo, goldTrimMat);
    tier3.position.set(0, 20.5, 0);
    this.group.add(tier3);

    // Pinnacle Spire & Golden Kalash (Reaching 28m high)
    const spireGeo = new THREE.ConeGeometry(4.2, 8.5, 8);
    const spireMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      metalness: 0.85,
      roughness: 0.15,
      emissive: 0xFFA000,
      emissiveIntensity: 0.8
    });
    this.festivalClock.registerEmissive(spireMat);
    const spire = new THREE.Mesh(spireGeo, spireMat);
    spire.position.set(0, 26.5, 0);
    this.group.add(spire);

    // Glowing Sacred Crest at Pinnacle
    const crestGeo = new THREE.SphereGeometry(1.2, 12, 12);
    const crestMat = new THREE.MeshBasicMaterial({ color: 0xFFF9C4 });
    const crest = new THREE.Mesh(crestGeo, crestMat);
    crest.position.set(0, 31.0, 0);
    this.group.add(crest);

    // Interior Brocade Silk Ceiling
    const ceilingTex = TextureGenerator.createBrocadeFabricTexture();
    const ceilingGeo = new THREE.PlaneGeometry(32, 26);
    const ceilingMat = new THREE.MeshStandardMaterial({ map: ceilingTex, roughness: 0.7 });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 13.8, 0);
    this.group.add(ceiling);

    // Interior Alpona Floor
    const alponaTex = TextureGenerator.createAlponaTexture();
    const intFloorGeo = new THREE.PlaneGeometry(32, 26);
    const intFloorMat = new THREE.MeshStandardMaterial({ map: alponaTex, roughness: 0.7 });
    const intFloor = new THREE.Mesh(intFloorGeo, intFloorMat);
    intFloor.rotation.x = -Math.PI / 2;
    intFloor.position.set(0, 1.42, 0);
    intFloor.receiveShadow = true;
    this.group.add(intFloor);
  }

  buildFacadeDetails() {
    // Grand Front Arched Portico Pillars
    const porticoPillars = [-12, -6, 6, 12];
    const pillarGeo = new THREE.CylinderGeometry(0.8, 0.95, 14, 16);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0xFFE082,
      metalness: 0.3,
      roughness: 0.3
    });

    porticoPillars.forEach((px) => {
      const p = new THREE.Mesh(pillarGeo, pillarMat);
      p.position.set(px, 7.7, 15.5);
      p.castShadow = true;
      this.group.add(p);

      // Gold capital on top of pillar
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 0.8, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: 0xFFB300, metalness: 0.8 })
      );
      cap.position.set(px, 14.8, 15.5);
      this.group.add(cap);
    });

    // Pandal Banner Signboard
    const signTex = TextureGenerator.createSignboardTexture(
      'धनबाद हाउसिंग कॉलोनी दुर्गोत्सव',
      'DHANBAD HOUSING COLONY SARBOJANIN DURGA PUJA 2026',
      'gold'
    );
    const signGeo = new THREE.PlaneGeometry(18, 3.4);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 14.8, 16.2);
    this.group.add(sign);

    // 2 Grand Tiered Chandeliers inside the Pandal
    [-4, 4].forEach((cz) => {
      const chandelier = new THREE.Group();
      chandelier.position.set(0, 11.5, cz);

      const ringGeo = new THREE.TorusGeometry(3.6, 0.16, 8, 24);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.9, roughness: 0.2 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      chandelier.add(ring);

      for (let c = 0; c < 12; c++) {
        const angle = (c * Math.PI * 2) / 12;
        const bulbGeo = new THREE.SphereGeometry(0.22, 8, 8);
        const bulbMat = new THREE.MeshStandardMaterial({
          color: 0xFFE082,
          emissive: 0xFFA000,
          emissiveIntensity: 2.2
        });
        this.festivalClock.registerEmissive(bulbMat);
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(Math.cos(angle) * 3.6, -0.4, Math.sin(angle) * 3.6);
        chandelier.add(bulb);
      }

      const chandelierLight = new THREE.PointLight(0xFFB300, 2.6, 26);
      chandelierLight.position.set(0, -0.6, 0);
      chandelierLight.userData.baseIntensity = 2.6;
      this.festivalClock.registerFestivalLight(chandelierLight);
      chandelier.add(chandelierLight);

      this.group.add(chandelier);
    });
  }

  buildSanctumAltar() {
    const altar = new THREE.Group();
    altar.position.set(0, 1.4, -9.5);

    // Elevated Altar Dais (Three-tier stepped marble dais)
    const daisGeo = new THREE.BoxGeometry(16, 1.4, 7);
    const daisMat = new THREE.MeshStandardMaterial({ color: 0xA8121E, roughness: 0.5 });
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.y = 0.7;
    altar.add(dais);

    // Ornate Golden Chalchitra (Halo Arch with intricate filigree)
    const haloGeo = new THREE.CylinderGeometry(6.5, 6.5, 0.45, 36, 1, false, 0, Math.PI);
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0xFF8F00,
      emissiveIntensity: 0.5
    });
    this.festivalClock.registerEmissive(haloMat);
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.z = -Math.PI / 2;
    halo.rotation.y = Math.PI / 2;
    halo.position.set(0, 6.4, -2.2);
    altar.add(halo);

    // Respectful Devotional Pratima Tableau (Golden Divine Silhouette)
    const pratimaGroup = new THREE.Group();
    pratimaGroup.position.set(0, 1.4, 0);

    const idolMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xFFA000,
      emissiveIntensity: 0.7
    });
    this.festivalClock.registerEmissive(idolMat);

    // Maa Durga Torso
    const torsoGeo = new THREE.CylinderGeometry(0.55, 0.9, 3.0, 12);
    const torso = new THREE.Mesh(torsoGeo, idolMat);
    torso.position.y = 3.8;
    pratimaGroup.add(torso);

    // Crown (Mukut)
    const crownGeo = new THREE.ConeGeometry(0.85, 1.6, 8);
    const crown = new THREE.Mesh(crownGeo, idolMat);
    crown.position.y = 6.0;
    pratimaGroup.add(crown);

    // Ten Divine Arms Silhouette
    for (let a = 0; a < 5; a++) {
      const angle = (a - 2) * 0.35;
      [-1, 1].forEach((side) => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 1.8, 8), idolMat);
        arm.position.set(side * (0.8 + Math.abs(angle) * 0.4), 4.2 + angle * 0.8, 0.2);
        arm.rotation.z = side * (0.6 + angle * 0.4);
        pratimaGroup.add(arm);
      });
    }

    // Lion Vahana Base
    const lion = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.5, 3.4), idolMat);
    lion.position.set(0, 1.1, 0.2);
    pratimaGroup.add(lion);

    // Radiant Golden Trishul
    const trishulPole = new THREE.CylinderGeometry(0.07, 0.07, 5.2, 8);
    const trishul = new THREE.Mesh(trishulPole, idolMat);
    trishul.position.set(1.1, 4.4, 0.9);
    trishul.rotation.z = -0.22;
    pratimaGroup.add(trishul);

    // Flanking Deities (Lakshmi, Saraswati, Ganesha, Kartikeya)
    const flankOffsets = [-5.2, -2.8, 2.8, 5.2];
    flankOffsets.forEach((fx) => {
      const flankFig = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.55, 2.5, 8), idolMat);
      flankFig.position.set(fx, 3.0, 0.2);
      pratimaGroup.add(flankFig);
    });

    altar.add(pratimaGroup);

    // Brass Diyas with Warm Flickering Flames
    const diyaPositions = [-6, -4, -2, 0, 2, 4, 6];
    const diyaMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.9, roughness: 0.1 });
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xFFCA28 });

    diyaPositions.forEach((dx) => {
      const diya = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.18, 0.2, 12), diyaMat);
      diya.position.set(dx, 1.45, 2.4);
      altar.add(diya);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 6), flameMat);
      flame.position.set(dx, 1.7, 2.4);
      altar.add(flame);
      this.flames.push(flame);
    });

    // Devotional Sanctum Spotlight
    const sanctumSpot = new THREE.SpotLight(0xFFE082, 4.0, 28, Math.PI / 4, 0.4);
    sanctumSpot.position.set(0, 12, -2);
    sanctumSpot.target = dais;
    sanctumSpot.userData.baseIntensity = 4.0;
    this.festivalClock.registerFestivalLight(sanctumSpot);
    altar.add(sanctumSpot);

    // Procedural Incense Smoke Particle System (Dhoonuchi smoke)
    this.createIncenseSmoke(altar);

    this.group.add(altar);
  }

  createIncenseSmoke(parent) {
    const smokeCount = 35;
    const smokeGeo = new THREE.SphereGeometry(0.2, 6, 6);
    const smokeMat = new THREE.MeshBasicMaterial({
      color: 0xE8E8E8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    for (let i = 0; i < smokeCount; i++) {
      const particle = new THREE.Mesh(smokeGeo, smokeMat);
      particle.position.set(
        (Math.random() - 0.5) * 1.8,
        1.6 + Math.random() * 4.5,
        1.5 + (Math.random() - 0.5) * 1.8
      );
      particle.userData = {
        speedY: 0.65 + Math.random() * 0.85,
        swaySpeed: 1.6 + Math.random() * 2.2,
        swayOffset: Math.random() * Math.PI * 2,
        initialY: 1.6,
        maxY: 7.2
      };
      parent.add(particle);
      this.smokeParticles.push(particle);
    }
  }

  buildQueueBarriers() {
    const railMat = new THREE.MeshStandardMaterial({ color: 0xFFB300, metalness: 0.85, roughness: 0.25 });
    for (let z = 2; z <= 14; z += 3) {
      [-4.0, 4.0].forEach((rx) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.2, 8), railMat);
        post.position.set(rx, 2.0, z);
        this.group.add(post);
      });
    }
  }

  buildEntranceDecorations() {
    // 2 Giant Brass Urns with Marigold Bouquets at Pandal Entrance
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.9, roughness: 0.15 });
    const flowerMat = new THREE.MeshStandardMaterial({ color: 0xFFB300, roughness: 0.8 });

    [-10, 10].forEach((ux) => {
      const urn = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.6, 1.4, 16), brassMat);
      urn.position.set(ux, 0.7, 18.5);
      this.group.add(urn);

      const bouquet = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 12), flowerMat);
      bouquet.position.set(ux, 1.8, 18.5);
      this.group.add(bouquet);
    });
  }

  update(delta, time) {
    // Diya flame flicker
    for (let i = 0; i < this.flames.length; i++) {
      const f = this.flames[i];
      const s = 0.85 + 0.35 * Math.sin(time * 14 + i * 2.2);
      f.scale.set(s, s * (1 + 0.25 * Math.cos(time * 16)), s);
    }

    // Incense smoke upward drift
    for (let i = 0; i < this.smokeParticles.length; i++) {
      const p = this.smokeParticles[i];
      p.position.y += p.userData.speedY * delta;
      p.position.x += Math.sin(time * p.userData.swaySpeed + p.userData.swayOffset) * delta * 0.35;
      p.scale.addScalar(delta * 0.35);

      if (p.position.y > p.userData.maxY) {
        p.position.y = p.userData.initialY;
        p.position.x = (Math.random() - 0.5) * 1.5;
        p.scale.set(1, 1, 1);
      }
    }
  }
}
