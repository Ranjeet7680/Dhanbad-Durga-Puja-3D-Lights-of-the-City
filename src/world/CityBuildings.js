import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';

export class CityBuildings {
  constructor(scene, festivalClock) {
    this.scene = scene;
    this.festivalClock = festivalClock;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.neonMaterials = [];
    this.windowMaterials = [];

    this.buildPerimeterStreets();
    this.buildStreetLifeProps();
  }

  buildPerimeterStreets() {
    // Modular Indian shopfront facades along the perimeter to surround the festival in a bustling city
    const shopNames = [
      { hi: 'धनबाद साड़ी सदन', en: 'DHANBAD SAREE SADAN', col: 0xFF1744, type: 'textile' },
      { hi: 'बंगाली मिष्ठान भंडार', en: 'BENGAL SWEETS & BAKERY', col: 0xFFB300, type: 'sweets' },
      { hi: 'कोलफील्ड इलेक्ट्रॉनिक्स', en: 'COALFIELD ELECTRONICS', col: 0x00E5FF, type: 'electronics' },
      { hi: 'मां तारा भोजनालय', en: 'MAA TARA BHOJANALAYA', col: 0xE64A19, type: 'food' },
      { hi: 'रॉयल ज्वेलर्स', en: 'ROYAL JEWELLERS', col: 0xFFD54F, type: 'textile' },
      { hi: 'न्यू धनबाद वस्त्रालय', en: 'NEW TEXTILE MART', col: 0xC2185B, type: 'textile' },
      { hi: 'अन्नपूर्णा मिष्ठान', en: 'ANNAPURNA SWEETS', col: 0xFF9100, type: 'sweets' },
      { hi: 'अशोक मेडिकल स्टोर', en: 'ASHOK MEDICAL STORE', col: 0x00897B, type: 'electronics' }
    ];

    // Building layout blocks lining the main roads (North, South, East, West)
    const buildingPlots = [
      // West Street (Artisan Road flanks)
      { x: -65, z: -18, w: 22, d: 16, h: 18, rot: 0, shopIdx: 0 },
      { x: -65, z: 18,  w: 22, d: 16, h: 22, rot: 0, shopIdx: 1 },
      { x: -45, z: -25, w: 18, d: 14, h: 16, rot: 0, shopIdx: 2 },
      { x: -45, z: 25,  w: 18, d: 14, h: 20, rot: 0, shopIdx: 3 },

      // East Street (Mela Road flanks)
      { x: 75,  z: -28, w: 24, d: 18, h: 20, rot: 0, shopIdx: 4 },
      { x: 75,  z: 28,  w: 24, d: 18, h: 24, rot: 0, shopIdx: 5 },
      { x: 25,  z: -26, w: 18, d: 14, h: 16, rot: 0, shopIdx: 6 },
      { x: 25,  z: 26,  w: 18, d: 14, h: 18, rot: 0, shopIdx: 7 },

      // South Street (Heritage Lane flanks)
      { x: -22, z: 55,  w: 18, d: 20, h: 22, rot: Math.PI / 2, shopIdx: 0 },
      { x: 22,  z: 55,  w: 18, d: 20, h: 20, rot: Math.PI / 2, shopIdx: 1 },
      { x: -22, z: 35,  w: 16, d: 16, h: 18, rot: Math.PI / 2, shopIdx: 2 },
      { x: 22,  z: 35,  w: 16, d: 16, h: 16, rot: Math.PI / 2, shopIdx: 3 },

      // North Far Flanks (beyond Pandal)
      { x: -32, z: -85, w: 24, d: 20, h: 26, rot: 0, shopIdx: 4 },
      { x: 32,  z: -85, w: 24, d: 20, h: 24, rot: 0, shopIdx: 5 }
    ];

    const wallColors = [0x2A2E3D, 0x332B38, 0x242D38, 0x362F2B, 0x2B3332];

    buildingPlots.forEach((p, idx) => {
      const bldg = new THREE.Group();
      bldg.position.set(p.x, 0, p.z);
      bldg.rotation.y = p.rot;

      const wallCol = wallColors[idx % wallColors.length];
      const bldgMat = new THREE.MeshStandardMaterial({
        color: wallCol,
        roughness: 0.85,
        metalness: 0.1
      });

      // Main Building Body
      const bodyGeo = new THREE.BoxGeometry(p.w, p.h, p.d);
      const bodyMesh = new THREE.Mesh(bodyGeo, bldgMat);
      bodyMesh.position.y = p.h / 2;
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      bldg.add(bodyMesh);

      // Roof Parapet / Water Tank
      const parapet = new THREE.Mesh(
        new THREE.BoxGeometry(p.w + 0.4, 0.8, p.d + 0.4),
        new THREE.MeshStandardMaterial({ color: 0x1A1D24, roughness: 0.9 })
      );
      parapet.position.y = p.h + 0.4;
      bldg.add(parapet);

      const waterTank = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 1.4, 2.2, 12),
        new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.5 })
      );
      waterTank.position.set(p.w * 0.25, p.h + 1.9, p.d * 0.2);
      bldg.add(waterTank);

      // Ground Floor Shopfront Awning & Windows
      const shopInfo = shopNames[p.shopIdx % shopNames.length];
      const shopAwning = new THREE.Mesh(
        new THREE.BoxGeometry(p.w * 0.85, 0.3, 2.2),
        new THREE.MeshStandardMaterial({ color: shopInfo.col, roughness: 0.6 })
      );
      shopAwning.position.set(0, 3.8, p.d / 2 + 1.0);
      shopAwning.rotation.x = 0.2;
      bldg.add(shopAwning);

      // Detailed Textured Indian Shopfront Display
      const shopTex = TextureGenerator.createShopfrontTexture(shopInfo.hi, shopInfo.en, shopInfo.type);
      const winMat = new THREE.MeshStandardMaterial({
        map: shopTex,
        roughness: 0.35,
        metalness: 0.1,
        emissive: 0x332211,
        emissiveIntensity: 0.35
      });
      this.windowMaterials.push(winMat);

      const shopWin = new THREE.Mesh(
        new THREE.PlaneGeometry(p.w * 0.8, 2.6),
        winMat
      );
      shopWin.position.set(0, 2.0, p.d / 2 + 0.05);
      bldg.add(shopWin);

      // Authentic Bilingual Commercial Signboard above awning
      const signTex = TextureGenerator.createSignboardTexture(
        shopInfo.hi,
        `${shopInfo.en} • DHANBAD`,
        'gold'
      );
      const signMat = new THREE.MeshStandardMaterial({
        map: signTex,
        roughness: 0.4,
        emissive: 0x221100,
        emissiveIntensity: 0.4
      });
      this.neonMaterials.push(signMat);

      const signBoard = new THREE.Mesh(
        new THREE.PlaneGeometry(p.w * 0.75, 1.2),
        signMat
      );
      signBoard.position.set(0, 4.8, p.d / 2 + 0.1);
      bldg.add(signBoard);

      // Upper Floor Windows (some lit warm, some dark)
      const floors = Math.floor(p.h / 4.5);
      for (let f = 1; f < floors; f++) {
        const yPos = f * 4.5 + 2.0;
        const winCols = 3;
        for (let w = 0; w < winCols; w++) {
          const xPos = (w - 1) * (p.w * 0.28);
          const isLit = Math.random() > 0.35;
          const uWinMat = new THREE.MeshStandardMaterial({
            color: isLit ? 0xFFD54F : 0x1E2430,
            emissive: isLit ? 0xFF8F00 : 0x000000,
            emissiveIntensity: isLit ? 0.75 : 0.0,
            roughness: 0.3
          });
          if (isLit) this.festivalClock.registerEmissive(uWinMat);

          const uWin = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.0), uWinMat);
          uWin.position.set(xPos, yPos, p.d / 2 + 0.05);
          bldg.add(uWin);

          // Small window balcony railing
          const balcony = new THREE.Mesh(
            new THREE.BoxGeometry(2.0, 0.6, 0.4),
            new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8 })
          );
          balcony.position.set(xPos, yPos - 0.7, p.d / 2 + 0.25);
          bldg.add(balcony);
        }
      }

      // Soft ambient light cast in front of shop entrance
      const shopLight = new THREE.PointLight(0xFFB300, 0.75, 8, 2);
      shopLight.position.set(0, 3.2, p.d / 2 + 2.0);
      shopLight.userData.baseIntensity = 0.75;
      this.festivalClock.registerFestivalLight(shopLight);
      bldg.add(shopLight);

      this.group.add(bldg);
    });
  }

  buildStreetLifeProps() {
    // 1. Parked Scooters / Motorcycles along the curb
    const vehicleMat = new THREE.MeshStandardMaterial({ color: 0x1E88E5, roughness: 0.4, metalness: 0.6 });
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

    const scooterPositions = [
      { x: 8, z: 12, rot: 0.4 },
      { x: -9, z: 14, rot: -0.3 },
      { x: 26, z: 4, rot: 1.5 },
      { x: -26, z: 3, rot: -1.4 },
      { x: 8, z: -14, rot: 0.8 }
    ];

    scooterPositions.forEach((v) => {
      const scooter = new THREE.Group();
      scooter.position.set(v.x, 0, v.z);
      scooter.rotation.y = v.rot;

      // Chassis
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 1.5), vehicleMat);
      body.position.y = 0.55;
      scooter.add(body);

      // Handlebar
      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.08, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xEEEEEE, metalness: 0.9 })
      );
      handle.position.set(0, 0.95, -0.45);
      scooter.add(handle);

      // Headlight
      const headLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xFFF9C4 })
      );
      headLight.position.set(0, 0.85, -0.75);
      scooter.add(headLight);

      // Wheels
      [-0.55, 0.55].forEach((wz) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 12), tireMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(0, 0.24, wz);
        scooter.add(wheel);
      });

      this.group.add(scooter);
    });

    // 2. Roadside Chai Kulhad Stand (Near Hub & South Road)
    const chaiStall = new THREE.Group();
    chaiStall.position.set(-11, 0, 10);

    // Wooden cart
    const cart = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.1, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.8 })
    );
    cart.position.y = 0.55;
    chaiStall.add(cart);

    // Chai brass boiling samovar / kettle
    const kettle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.35, 0.65, 12),
      new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.85, roughness: 0.2 })
    );
    kettle.position.set(-0.4, 1.4, 0);
    chaiStall.add(kettle);

    // Clay cups (Kulhads) on tray
    for (let k = 0; k < 6; k++) {
      const kulhad = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.04, 0.12, 8),
        new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.9 })
      );
      kulhad.position.set(0.3 + (k % 3) * 0.15, 1.15, -0.2 + Math.floor(k / 3) * 0.18);
      chaiStall.add(kulhad);
    }

    // Warm hanging hurricane lantern
    const lantern = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xFFE082, emissive: 0xFFA000, emissiveIntensity: 2.0 })
    );
    lantern.position.set(0, 2.2, 0);
    this.festivalClock.registerEmissive(lantern.material);
    chaiStall.add(lantern);

    const cLight = new THREE.PointLight(0xFFB300, 1.4, 8);
    cLight.position.set(0, 2.0, 0);
    cLight.userData.baseIntensity = 1.4;
    this.festivalClock.registerFestivalLight(cLight);
    chaiStall.add(cLight);

    this.group.add(chaiStall);

    // 3. Flower Vendor Cart (Fresh Marigolds & Rose Petals)
    const flowerCart = new THREE.Group();
    flowerCart.position.set(11, 0, -10);

    const fBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 1.0, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.8 })
    );
    fBase.position.y = 0.5;
    flowerCart.add(fBase);

    // Baskets of orange and yellow marigold garlands
    const basketColors = [0xFF6F00, 0xFFD54F, 0xE65100, 0xFFB300];
    basketColors.forEach((bCol, idx) => {
      const bx = (idx % 2 === 0 ? -0.5 : 0.5);
      const bz = (idx < 2 ? -0.4 : 0.4);
      const flowers = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 10, 10),
        new THREE.MeshStandardMaterial({ color: bCol, roughness: 0.85 })
      );
      flowers.position.set(bx, 1.15, bz);
      flowerCart.add(flowers);
    });

    this.group.add(flowerCart);
  }
}
