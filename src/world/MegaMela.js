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
    this.wheelRadius = 15;
    this.wheelCenterHeight = 18;
    this.gondolas = [];
    this.wheelNeonBulbs = [];
    this.wheelRotationSpeed = 0.28;
    this.wheelAngle = 0;
    this.isRideActive = false;

    // Carousel elements
    this.carouselSpeed = 0.55;
    this.carouselHorses = [];

    this.buildGroundPlaza();
    this.buildGiantWheel();
    this.buildCarousel();
    this.buildFoodLane();
    this.buildGameStall();
    this.buildDhakStage();
  }

  buildGroundPlaza() {
    // Mela grounds floor (packed earth / festival ground)
    const melaFloorGeo = new THREE.PlaneGeometry(65, 55);
    const melaFloorMat = new THREE.MeshStandardMaterial({
      color: 0x2A1C14,
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
      'DHANBAD MEGA FAIRGROUND • JHULA, GAMES & FOOD',
      'gold'
    );
    const signGeo = new THREE.PlaneGeometry(13, 2.6);
    const signMat = new THREE.MeshBasicMaterial({ map: archTex });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(-22, 7.0, 0);
    sign.rotation.y = Math.PI / 2;
    this.group.add(sign);

    // Two Entry Pillars with Golden Cones
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xFFB300, roughness: 0.4, metalness: 0.6 });
    [-6, 6].forEach((pz) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 7.5, 12), pillarMat);
      p.position.set(-22, 3.75, pz);
      this.group.add(p);
    });
  }

  buildGiantWheel() {
    this.wheelGroup = new THREE.Group();
    this.wheelGroup.position.set(0, 0, -12);

    // Two A-Frame Support Towers (Steel lattice truss look)
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xC62828, // Bright fairground crimson steel
      metalness: 0.8,
      roughness: 0.25
    });

    [-2.4, 2.4].forEach((zOffset) => {
      const legGeo = new THREE.CylinderGeometry(0.24, 0.4, 20.5, 8);
      const leftLeg = new THREE.Mesh(legGeo, steelMat);
      leftLeg.position.set(-4.8, 10, zOffset);
      leftLeg.rotation.z = -0.24;
      this.wheelGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, steelMat);
      rightLeg.position.set(4.8, 10, zOffset);
      rightLeg.rotation.z = 0.24;
      this.wheelGroup.add(rightLeg);

      // Cross braces between legs
      [5, 10, 15].forEach((h) => {
        const brace = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 5.5, 6),
          steelMat
        );
        brace.position.set(0, h, zOffset);
        brace.rotation.z = Math.PI / 2;
        this.wheelGroup.add(brace);
      });
    });

    // Central Axle
    const axleGeo = new THREE.CylinderGeometry(0.6, 0.6, 5.6, 16);
    const axleMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.9, roughness: 0.2 });
    const axle = new THREE.Mesh(axleGeo, axleMat);
    axle.rotation.x = Math.PI / 2;
    axle.position.set(0, this.wheelCenterHeight, 0);
    this.wheelGroup.add(axle);

    // Rotating Wheel Structure
    this.rotatingWheel = new THREE.Group();
    this.rotatingWheel.position.set(0, this.wheelCenterHeight, 0);

    const rimMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.85, roughness: 0.2 });
    [-1.8, 1.8].forEach((zOffset) => {
      const rimGeo = new THREE.TorusGeometry(this.wheelRadius, 0.25, 12, 48);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.position.z = zOffset;
      this.rotatingWheel.add(rim);

      const innerRimGeo = new THREE.TorusGeometry(this.wheelRadius * 0.65, 0.18, 8, 36);
      const innerRim = new THREE.Mesh(innerRimGeo, rimMat);
      innerRim.position.z = zOffset;
      this.rotatingWheel.add(innerRim);
    });

    // 12 Spokes with Neon LED Bulbs
    const spokeCount = 12;
    const spokeGeo = new THREE.CylinderGeometry(0.09, 0.09, this.wheelRadius * 2, 8);
    const spokeMat = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, metalness: 0.85, roughness: 0.3 });

    for (let i = 0; i < spokeCount / 2; i++) {
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.rotation.z = (i * Math.PI) / (spokeCount / 2);
      this.rotatingWheel.add(spoke);
    }

    // Glowing Neon Nodes along Spokes and Outer Rims
    const neonColors = [0x00E5FF, 0xFF1744, 0x76FF03, 0xFFEA00, 0xE040FB, 0xFF9100];
    const bulbGeo = new THREE.SphereGeometry(0.18, 8, 8);

    for (let i = 0; i < spokeCount; i++) {
      const angle = (i * Math.PI * 2) / spokeCount;
      const col = neonColors[i % neonColors.length];
      const bulbMat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 2.2
      });
      this.festivalClock.registerEmissive(bulbMat);

      // 3 bulbs along each spoke radius
      [0.4, 0.7, 0.95].forEach((frac) => {
        const b = new THREE.Mesh(bulbGeo, bulbMat);
        b.position.set(
          Math.cos(angle) * this.wheelRadius * frac,
          Math.sin(angle) * this.wheelRadius * frac,
          1.8
        );
        this.rotatingWheel.add(b);
        this.wheelNeonBulbs.push({ mesh: b, offset: i * 0.5 + frac });
      });
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

      // Cabin
      const cabinGeo = new THREE.BoxGeometry(2.2, 1.9, 2.4);
      const cabin = new THREE.Mesh(cabinGeo, gondolaMat);
      cabin.position.y = -0.95;
      gondolaPivot.add(cabin);

      // Canopy roof
      const roofGeo = new THREE.ConeGeometry(1.7, 0.9, 4);
      const roof = new THREE.Mesh(roofGeo, rimMat);
      roof.position.y = 0.45;
      roof.rotation.y = Math.PI / 4;
      gondolaPivot.add(roof);

      // Warm interior cabin lantern
      const cabLight = new THREE.PointLight(0xFFE082, 0.8, 4);
      cabLight.position.y = -0.5;
      gondolaPivot.add(cabLight);

      this.rotatingWheel.add(gondolaPivot);
      this.gondolas.push(gondolaPivot);
    }

    this.wheelGroup.add(this.rotatingWheel);

    // Boarding Platform with Safety Railings & Boarding Stairs
    const platformGeo = new THREE.BoxGeometry(6.5, 1.8, 5.5);
    const platformMat = new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.8 });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.set(0, 0.9, 0);
    this.wheelGroup.add(platform);

    const railMat = new THREE.MeshStandardMaterial({ color: 0xFFB300, metalness: 0.8 });
    const rail = new THREE.Mesh(new THREE.BoxGeometry(6.3, 0.9, 0.1), railMat);
    rail.position.set(0, 2.25, 2.6);
    this.wheelGroup.add(rail);

    // Boarding Stairs
    for (let st = 0; st < 4; st++) {
      const stair = new THREE.Mesh(
        new THREE.BoxGeometry(4.0, 0.22, 0.6),
        platformMat
      );
      stair.position.set(0, st * 0.22 + 0.11, 2.9 + st * 0.6);
      this.wheelGroup.add(stair);
    }

    // Ride Operator Booth (Imran's station)
    const boothGeo = new THREE.BoxGeometry(2.4, 2.8, 2.4);
    const boothMat = new THREE.MeshStandardMaterial({ color: 0x0277BD, roughness: 0.6 });
    const booth = new THREE.Mesh(boothGeo, boothMat);
    booth.position.set(5.2, 1.4, 3.5);
    this.wheelGroup.add(booth);

    // Wheel Fairground Spotlight
    const melaSpot = new THREE.PointLight(0xFFAB00, 2.4, 40);
    melaSpot.position.set(0, this.wheelCenterHeight, 10);
    melaSpot.userData.baseIntensity = 2.4;
    this.festivalClock.registerFestivalLight(melaSpot);
    this.wheelGroup.add(melaSpot);

    this.group.add(this.wheelGroup);
  }

  buildCarousel() {
    this.carouselGroup = new THREE.Group();
    this.carouselGroup.position.set(0, 0, 16);

    this.carouselDeck = new THREE.Group();

    // Round Floor
    const deckGeo = new THREE.CylinderGeometry(6.4, 6.6, 0.6, 24);
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x880E4F, roughness: 0.6 });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.y = 0.3;
    this.carouselDeck.add(deck);

    // Center Ornate Mirrored Pillar
    const centerPillarGeo = new THREE.CylinderGeometry(1.5, 1.5, 4.8, 16);
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.9, roughness: 0.1 });
    const centerPillar = new THREE.Mesh(centerPillarGeo, pillarMat);
    centerPillar.position.y = 2.7;
    this.carouselDeck.add(centerPillar);

    // Striped Pagoda Canopy Roof
    const canopyGeo = new THREE.ConeGeometry(7.5, 2.4, 24);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xFFC107, roughness: 0.4 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.y = 5.5;
    this.carouselDeck.add(canopy);

    // 6 Wooden Festival Horses / Seats
    const horseCount = 6;
    for (let i = 0; i < horseCount; i++) {
      const angle = (i * Math.PI * 2) / horseCount;
      const horseGroup = new THREE.Group();
      horseGroup.position.set(Math.cos(angle) * 4.4, 1.9, Math.sin(angle) * 4.4);
      horseGroup.rotation.y = -angle + Math.PI / 2;

      // Brass pole
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 4.0, 8),
        new THREE.MeshStandardMaterial({ color: 0xFFD54F, metalness: 0.9 })
      );
      horseGroup.add(pole);

      // Stylized festival horse body
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.65, 1.7),
        new THREE.MeshStandardMaterial({ color: 0xE65100, roughness: 0.5 })
      );
      horseGroup.add(body);

      this.carouselHorses.push({
        group: horseGroup,
        baseY: 1.9,
        offset: i * 1.2
      });

      this.carouselDeck.add(horseGroup);
    }

    this.carouselGroup.add(this.carouselDeck);
    this.group.add(this.carouselGroup);
  }

  buildFoodLane() {
    const stalls = [
      { name: 'KOLKATA PUCHKA & CHAAT', sub: 'Spicy Tamarind Water & Crispy Puris', x: -16, z: -4 },
      { name: 'GARAM JALEBI & MITHAI', sub: 'Golden Crispy Jalebis & Rabri', x: -16, z: 6 },
      { name: 'DHANBAD SPECIAL CHAI ADDA', sub: 'Kulhad Chai & Festival Adda', x: -16, z: 16 }
    ];

    stalls.forEach((s) => {
      const stall = new THREE.Group();
      stall.position.set(s.x, 0, s.z);

      const counterGeo = new THREE.BoxGeometry(4.4, 1.2, 2.4);
      const counterMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.8 });
      const counter = new THREE.Mesh(counterGeo, counterMat);
      counter.position.y = 0.6;
      stall.add(counter);

      const signTex = TextureGenerator.createSignboardTexture(s.name, s.sub, 'gold');
      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(4.2, 1.05),
        new THREE.MeshBasicMaterial({ map: signTex })
      );
      sign.position.set(0, 3.3, 1.25);
      stall.add(sign);

      const awningGeo = new THREE.BoxGeometry(4.6, 0.2, 2.8);
      const awningMat = new THREE.MeshStandardMaterial({ color: 0xC2185B, roughness: 0.6 });
      const awning = new THREE.Mesh(awningGeo, awningMat);
      awning.position.set(0, 3.2, 0);
      awning.rotation.x = 0.15;
      stall.add(awning);

      // Warm Stall Light
      const sLight = new THREE.PointLight(0xFFB300, 1.3, 9);
      sLight.position.set(0, 2.9, 0);
      sLight.userData.baseIntensity = 1.3;
      this.festivalClock.registerFestivalLight(sLight);
      stall.add(sLight);

      this.group.add(stall);
    });
  }

  buildGameStall() {
    const stall = new THREE.Group();
    stall.position.set(16, 0, 6);

    const booth = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 3.4, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x00695C, roughness: 0.7 })
    );
    booth.position.y = 1.7;
    stall.add(booth);

    const signTex = TextureGenerator.createSignboardTexture('🎯 RING TOSS FESTIVAL STALL', 'Win Festive Souvenirs & Tokens', 'blue');
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.05), new THREE.MeshBasicMaterial({ map: signTex }));
    sign.position.set(0, 3.6, 1.65);
    stall.add(sign);

    this.group.add(stall);
  }

  buildDhakStage() {
    const stage = new THREE.Group();
    stage.position.set(16, 0, -6);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 4.0, 0.85, 16),
      new THREE.MeshStandardMaterial({ color: 0xBF360C, roughness: 0.6 })
    );
    platform.position.y = 0.42;
    stage.add(platform);

    const drum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 1.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.5 })
    );
    drum.rotation.z = Math.PI / 2;
    drum.position.set(0, 1.25, 0);
    stage.add(drum);

    const feather = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 1.3, 6),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    feather.position.set(0.65, 1.85, 0);
    stage.add(feather);

    this.group.add(stage);
  }

  update(delta, time) {
    // Rotate the Giant Wheel
    this.wheelAngle += this.wheelRotationSpeed * delta;
    this.rotatingWheel.rotation.z = this.wheelAngle;

    // Gravity compensation for gondolas
    for (let i = 0; i < this.gondolas.length; i++) {
      this.gondolas[i].rotation.z = -this.wheelAngle;
    }

    // Dynamic chasing wave on neon rim bulbs
    for (let i = 0; i < this.wheelNeonBulbs.length; i++) {
      const nb = this.wheelNeonBulbs[i];
      const intensity = 0.7 + 0.5 * Math.sin(time * 6 + nb.offset);
      nb.mesh.scale.setScalar(intensity);
    }

    // Rotate Carousel
    this.carouselDeck.rotation.y += this.carouselSpeed * delta;

    // Bob carousel horses
    for (let i = 0; i < this.carouselHorses.length; i++) {
      const h = this.carouselHorses[i];
      h.group.position.y = h.baseY + Math.sin(time * 3 + h.offset) * 0.35;
    }
  }

  getBoardingGondolaPosition() {
    const normAngle = (this.wheelAngle + Math.PI / 2) % (Math.PI * 2);
    const lowestIdx = Math.round((normAngle / (Math.PI * 2)) * 12) % 12;
    const targetGondola = this.gondolas[lowestIdx];

    const worldPos = new THREE.Vector3();
    targetGondola.getWorldPosition(worldPos);
    return { position: worldPos, gondola: targetGondola };
  }
}
