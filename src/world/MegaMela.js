import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';

export class MegaMela {
  constructor(scene, festivalClock) {
    this.scene = scene;
    this.festivalClock = festivalClock;
    this.group = new THREE.Group();
    // Positioned East of Central Hub / Railway Ground
    this.group.position.set(45, 0, 5);
    this.scene.add(this.group);

    // Ferris Wheel elements
    this.wheelRadius = 14;
    this.wheelCenterHeight = 17;
    this.gondolas = [];
    this.wheelRotationSpeed = 0.25; // Radians per sec
    this.wheelAngle = 0;
    this.isRideActive = false;

    // Carousel elements
    this.carouselSpeed = 0.5;
    this.carouselHorses = [];

    this.buildGroundPlaza();
    this.buildGiantWheel();
    this.buildCarousel();
    this.buildFoodLane();
    this.buildGameStall();
    this.buildDhakStage();
  }

  buildGroundPlaza() {
    // Mela grounds floor (packed earth / festive ground)
    const melaFloorGeo = new THREE.PlaneGeometry(60, 50);
    const melaFloorMat = new THREE.MeshStandardMaterial({
      color: 0x33251B,
      roughness: 0.95
    });
    const melaFloor = new THREE.Mesh(melaFloorGeo, melaFloorMat);
    melaFloor.rotation.x = -Math.PI / 2;
    melaFloor.position.y = 0.02;
    melaFloor.receiveShadow = true;
    this.group.add(melaFloor);

    // Mela Welcome Arch
    const archTex = TextureGenerator.createSignboardTexture(
      '🎡 धनबाद मेगा मेला 🎡',
      'Mega Fairground • Jhula, Games, Food & Joy',
      'gold'
    );
    const signGeo = new THREE.PlaneGeometry(12, 2.4);
    const signMat = new THREE.MeshBasicMaterial({ map: archTex });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(-20, 6.5, 0);
    sign.rotation.y = Math.PI / 2;
    this.group.add(sign);

    // Two entry pillars for Mela
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xFFB300, roughness: 0.5 });
    [-5, 5].forEach((pz) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 7, 12), pillarMat);
      p.position.set(-20, 3.5, pz);
      this.group.add(p);
    });
  }

  buildGiantWheel() {
    this.wheelGroup = new THREE.Group();
    this.wheelGroup.position.set(0, 0, -12);

    // Two A-Frame Support Towers (Steel lattice)
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xD32F2F, // Festive crimson steel
      metalness: 0.7,
      roughness: 0.3
    });

    [-2.2, 2.2].forEach((zOffset) => {
      // Left leg
      const legGeo = new THREE.CylinderGeometry(0.2, 0.35, 19, 8);
      const leftLeg = new THREE.Mesh(legGeo, steelMat);
      leftLeg.position.set(-4.5, 9, zOffset);
      leftLeg.rotation.z = -0.24;
      this.wheelGroup.add(leftLeg);

      // Right leg
      const rightLeg = new THREE.Mesh(legGeo, steelMat);
      rightLeg.position.set(4.5, 9, zOffset);
      rightLeg.rotation.z = 0.24;
      this.wheelGroup.add(rightLeg);
    });

    // Central Axle
    const axleGeo = new THREE.CylinderGeometry(0.5, 0.5, 5.2, 16);
    const axleMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.9, roughness: 0.2 });
    const axle = new THREE.Mesh(axleGeo, axleMat);
    axle.rotation.x = Math.PI / 2;
    axle.position.set(0, this.wheelCenterHeight, 0);
    this.wheelGroup.add(axle);

    // The Rotating Wheel Structure
    this.rotatingWheel = new THREE.Group();
    this.rotatingWheel.position.set(0, this.wheelCenterHeight, 0);

    // Two concentric outer rims
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.8, roughness: 0.2 });
    [-1.6, 1.6].forEach((zOffset) => {
      const rimGeo = new THREE.TorusGeometry(this.wheelRadius, 0.22, 12, 48);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.z = zOffset;
      this.rotatingWheel.add(rim);

      const innerRimGeo = new THREE.TorusGeometry(this.wheelRadius * 0.65, 0.16, 8, 36);
      const innerRim = new THREE.Mesh(innerRimGeo, rimMat);
      innerRim.position.z = zOffset;
      this.rotatingWheel.add(innerRim);
    });

    // 12 Spokes with Neon LED strips
    const spokeCount = 12;
    const spokeGeo = new THREE.CylinderGeometry(0.08, 0.08, this.wheelRadius * 2, 8);
    const spokeMat = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, metalness: 0.8, roughness: 0.3 });

    for (let i = 0; i < spokeCount / 2; i++) {
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.rotation.z = (i * Math.PI) / (spokeCount / 2);
      this.rotatingWheel.add(spoke);
    }

    // 12 Passenger Gondolas
    const gondolaColors = [0xFF1744, 0x00E5FF, 0xFFEA00, 0x76FF03, 0xD500F9, 0xFF6D00];
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i * Math.PI * 2) / spokeCount;
      const gondolaMat = new THREE.MeshStandardMaterial({
        color: gondolaColors[i % gondolaColors.length],
        roughness: 0.4
      });

      const gondolaPivot = new THREE.Group();
      gondolaPivot.position.set(
        Math.cos(angle) * this.wheelRadius,
        Math.sin(angle) * this.wheelRadius,
        0
      );

      // Gondola cabin
      const cabinGeo = new THREE.BoxGeometry(2.0, 1.8, 2.2);
      const cabin = new THREE.Mesh(cabinGeo, gondolaMat);
      cabin.position.y = -0.9;
      gondolaPivot.add(cabin);

      // Canopy roof
      const roofGeo = new THREE.ConeGeometry(1.6, 0.8, 4);
      const roof = new THREE.Mesh(roofGeo, rimMat);
      roof.position.y = 0.4;
      roof.rotation.y = Math.PI / 4;
      gondolaPivot.add(roof);

      this.rotatingWheel.add(gondolaPivot);
      this.gondolas.push(gondolaPivot);
    }

    this.wheelGroup.add(this.rotatingWheel);

    // Boarding Platform
    const platformGeo = new THREE.BoxGeometry(6, 1.8, 5);
    const platformMat = new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.8 });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.set(0, 0.9, 0);
    this.wheelGroup.add(platform);

    // Platform Safety Railings
    const railMat = new THREE.MeshStandardMaterial({ color: 0xFFB300 });
    const railGeo = new THREE.BoxGeometry(5.8, 0.9, 0.1);
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(0, 2.25, 2.4);
    this.wheelGroup.add(rail);

    // Ride Operator Booth (Imran's station)
    const boothGeo = new THREE.BoxGeometry(2.2, 2.6, 2.2);
    const boothMat = new THREE.MeshStandardMaterial({ color: 0x0277BD, roughness: 0.6 });
    const booth = new THREE.Mesh(boothGeo, boothMat);
    booth.position.set(4.5, 1.3, 3);
    this.wheelGroup.add(booth);

    // Festive illumination for the wheel
    const melaSpot = new THREE.PointLight(0xFFAB00, 2.0, 35);
    melaSpot.position.set(0, this.wheelCenterHeight, 8);
    melaSpot.userData.baseIntensity = 2.0;
    this.festivalClock.registerFestivalLight(melaSpot);
    this.wheelGroup.add(melaSpot);

    this.group.add(this.wheelGroup);
  }

  buildCarousel() {
    this.carouselGroup = new THREE.Group();
    this.carouselGroup.position.set(0, 0, 16);

    // Rotating platform
    this.carouselDeck = new THREE.Group();

    // Round floor
    const deckGeo = new THREE.CylinderGeometry(6, 6.2, 0.6, 24);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x880E4F, roughness: 0.6 });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.y = 0.3;
    this.carouselDeck.add(deck);

    // Center ornate mirrored pillar
    const centerPillarGeo = new THREE.CylinderGeometry(1.4, 1.4, 4.5, 16);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.9, roughness: 0.1 });
    const centerPillar = new THREE.Mesh(centerPillarGeo, pillarMat);
    centerPillar.position.y = 2.5;
    this.carouselDeck.add(centerPillar);

    // Top Striped Canopy
    const canopyGeo = new THREE.ConeGeometry(7, 2.2, 24);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xFFC107, roughness: 0.4 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.y = 5.2;
    this.carouselDeck.add(canopy);

    // 6 Wooden Festival Horses / Seats
    const horseCount = 6;
    for (let i = 0; i < horseCount; i++) {
      const angle = (i * Math.PI * 2) / horseCount;
      const horseGroup = new THREE.Group();
      horseGroup.position.set(Math.cos(angle) * 4.2, 1.8, Math.sin(angle) * 4.2);
      horseGroup.rotation.y = -angle + Math.PI / 2;

      // Brass pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 3.8, 8),
        new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.9 })
      );
      horseGroup.add(pole);

      // Stylized festival horse body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.6, 1.6),
        new THREE.MeshStandardMaterial({ color: 0xE65100, roughness: 0.5 })
      );
      body.position.y = 0;
      horseGroup.add(body);

      this.carouselHorses.push({
        group: horseGroup,
        baseY: 1.8,
        offset: i * 1.2
      });

      this.carouselDeck.add(horseGroup);
    }

    this.carouselGroup.add(this.carouselDeck);
    this.group.add(this.carouselGroup);
  }

  buildFoodLane() {
    // 3 Food stalls with striped awnings
    const stalls = [
      { name: 'KOLKATA PUCHKA & CHAAT', sub: 'Spicy Tamarind Water & Crispy Puris', x: -16, z: -4 },
      { name: 'GARAM JALEBI & MITHAI', sub: 'Golden Crispy Jalebis & Rabri', x: -16, z: 6 },
      { name: 'DHANBAD SPECIAL CHAI ADDA', sub: 'Kulhad Chai & Festival Adda', x: -16, z: 16 }
    ];

    stalls.forEach((s) => {
      const stall = new THREE.Group();
      stall.position.set(s.x, 0, s.z);

      // Counter
      const counterGeo = new THREE.BoxGeometry(4.2, 1.2, 2.2);
      const counterMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.8 });
      const counter = new THREE.Mesh(counterGeo, counterMat);
      counter.position.y = 0.6;
      stall.add(counter);

      // Signboard
      const signTex = TextureGenerator.createSignboardTexture(s.name, s.sub, 'gold');
      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(4.0, 1.0),
        new THREE.MeshBasicMaterial({ map: signTex })
      );
      sign.position.set(0, 3.2, 1.15);
      stall.add(sign);

      // Striped Awning
      const awningGeo = new THREE.BoxGeometry(4.4, 0.2, 2.6);
      const awningMat = new THREE.MeshStandardMaterial({ color: 0xC2185B, roughness: 0.6 });
      const awning = new THREE.Mesh(awningGeo, awningMat);
      awning.position.set(0, 3.1, 0);
      awning.rotation.x = 0.15;
      stall.add(awning);

      // Warm Stall Light
      const sLight = new THREE.PointLight(0xFFB300, 1.2, 8);
      sLight.position.set(0, 2.8, 0);
      sLight.userData.baseIntensity = 1.2;
      this.festivalClock.registerFestivalLight(sLight);
      stall.add(sLight);

      this.group.add(stall);
    });
  }

  buildGameStall() {
    // Ring Toss / Target stall
    const stall = new THREE.Group();
    stall.position.set(16, 0, 6);

    const booth = new THREE.Mesh(
      new THREE.BoxGeometry(5, 3.2, 3),
      new THREE.MeshStandardMaterial({ color: 0x00695C, roughness: 0.7 })
    );
    booth.position.y = 1.6;
    stall.add(booth);

    const signTex = TextureGenerator.createSignboardTexture('🎯 RING TOSS FESTIVAL STALL', 'Win Festive Souvenirs & Tokens', 'blue');
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 1.0), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 3.5, 1.55);
    stall.add(sign);

    this.group.add(stall);
  }

  buildDhakStage() {
    // Dhak drumming platform
    const stage = new THREE.Group();
    stage.position.set(16, 0, -6);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.8, 0.8, 16),
      new THREE.MeshStandardMaterial({ color: 0xBF360C, roughness: 0.6 })
    );
    platform.position.y = 0.4;
    stage.add(platform);

    // Dhak drum prop on stage
    const drum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 1.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.5 })
    );
    drum.rotation.z = Math.PI / 2;
    drum.position.set(0, 1.2, 0);
    stage.add(drum);

    // Decorative white feathers (Kash Phool) on the drum
    const feather = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 1.2, 6),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    feather.position.set(0.6, 1.8, 0);
    stage.add(feather);

    this.group.add(stage);
  }

  update(delta, time) {
    // Rotate the Giant Wheel
    this.wheelAngle += this.wheelRotationSpeed * delta;
    this.rotatingWheel.rotation.z = this.wheelAngle;

    // Correct each gondola's angle so it hangs upright due to gravity
    for (let i = 0; i < this.gondolas.length; i++) {
      this.gondolas[i].rotation.z = -this.wheelAngle;
    }

    // Rotate Carousel deck
    this.carouselDeck.rotation.y += this.carouselSpeed * delta;

    // Bob carousel horses up and down
    for (let i = 0; i < this.carouselHorses.length; i++) {
      const h = this.carouselHorses[i];
      h.group.position.y = h.baseY + Math.sin(time * 3 + h.offset) * 0.35;
    }
  }

  // Get position of lowest gondola for boarding
  getBoardingGondolaPosition() {
    // Lowest gondola index closest to bottom (angle ~ -PI/2)
    const normAngle = (this.wheelAngle + Math.PI / 2) % (Math.PI * 2);
    const lowestIdx = Math.round((normAngle / (Math.PI * 2)) * 12) % 12;
    const targetGondola = this.gondolas[lowestIdx];

    const worldPos = new THREE.Vector3();
    targetGondola.getWorldPosition(worldPos);
    return { position: worldPos, gondola: targetGondola };
  }
}
