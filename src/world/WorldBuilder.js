import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';
import { CentralHub } from './CentralHub.js';
import { LightTunnel } from './LightTunnel.js';
import { HousingColonyPandal } from './HousingColonyPandal.js';
import { MegaMela } from './MegaMela.js';
import { SkyAtmosphere } from './SkyAtmosphere.js';
import { CityBuildings } from './CityBuildings.js';

export class WorldBuilder {
  constructor(scene, engine, festivalClock) {
    this.scene = scene;
    this.engine = engine;
    this.festivalClock = festivalClock;

    this.collectibles = [];
    this.treeInstances = [];
    this.groundRings = [];

    this.initSkyAtmosphere();
    this.initTerrain();
    this.initRoads();
    this.initSubsystems();
    this.initCityBuildings();
    this.initDistrictGateways();
    this.initCivicHelpdesk();
    this.initStreetFoodAndChaiStall();
    this.initArtisanCourtyard();
    this.initBoundaryAndDecorations();
    this.initInteractionRings();
    this.initStreetLighting();
  }

  initSkyAtmosphere() {
    this.skyAtmosphere = new SkyAtmosphere(this.scene, this.festivalClock);
    this.engine.addUpdatable(this.skyAtmosphere);
  }

  initTerrain() {
    // Vast ground terrain with dark urban pavement texture
    const terrainGeo = new THREE.PlaneGeometry(320, 320, 32, 32);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1B1F2A, // Rich dark urban slate / paved festival precinct
      roughness: 0.85,
      metalness: 0.1
    });
    this.terrain = new THREE.Mesh(terrainGeo, terrainMat);
    this.terrain.rotation.x = -Math.PI / 2;
    this.terrain.position.y = 0;
    this.terrain.receiveShadow = true;
    this.scene.add(this.terrain);
  }

  initRoads() {
    const roadMat = new THREE.MeshStandardMaterial({
      map: TextureGenerator.createRoadTexture(),
      roughness: 0.65,
      metalness: 0.2
    });

    // 1. North Road: Central Hub (z=0) -> Light Tunnel -> Housing Colony Pandal (z=-65)
    const northRoadGeo = new THREE.PlaneGeometry(14, 80);
    const northRoad = new THREE.Mesh(northRoadGeo, roadMat);
    northRoad.rotation.x = -Math.PI / 2;
    northRoad.position.set(0, 0.02, -35);
    northRoad.receiveShadow = true;
    this.scene.add(northRoad);

    // 2. East Road: Central Hub (x=0) -> Mega Mela (x=45)
    const eastRoadGeo = new THREE.PlaneGeometry(48, 12);
    const eastRoad = new THREE.Mesh(eastRoadGeo, roadMat);
    eastRoad.rotation.x = -Math.PI / 2;
    eastRoad.position.set(24, 0.02, 0);
    eastRoad.receiveShadow = true;
    this.scene.add(eastRoad);

    // 3. West Road: Central Hub -> Artisan Lane / Jharudih (x=-40)
    const westRoadGeo = new THREE.PlaneGeometry(42, 10);
    const westRoad = new THREE.Mesh(westRoadGeo, roadMat);
    westRoad.rotation.x = -Math.PI / 2;
    westRoad.position.set(-21, 0.02, 0);
    westRoad.receiveShadow = true;
    this.scene.add(westRoad);

    // 4. South Road: Central Hub -> Purana Bazar & Hirapur Heritage Lane (z=40)
    const southRoadGeo = new THREE.PlaneGeometry(12, 52);
    const southRoad = new THREE.Mesh(southRoadGeo, roadMat);
    southRoad.rotation.x = -Math.PI / 2;
    southRoad.position.set(0, 0.02, 26);
    southRoad.receiveShadow = true;
    this.scene.add(southRoad);
  }

  initSubsystems() {
    this.centralHub = new CentralHub(this.scene, this.festivalClock);
    this.engine.addUpdatable(this.centralHub);

    this.lightTunnel = new LightTunnel(this.scene, this.festivalClock);
    this.engine.addUpdatable(this.lightTunnel);

    this.housingPandal = new HousingColonyPandal(this.scene, this.festivalClock);
    this.engine.addUpdatable(this.housingPandal);

    this.megaMela = new MegaMela(this.scene, this.festivalClock);
    this.engine.addUpdatable(this.megaMela);
  }

  initDistrictGateways() {
    // Overhead thematic arches connecting the Central Hub to adjacent districts
    const gateways = [
      // East Gateway to Mega Mela
      {
        x: 18, z: 0, rot: Math.PI / 2,
        title: 'धनबाद विशाल मेला प्रांगण • MEGAMELA',
        subtitle: '24m Giant Wheel • Food Lane • Fairground Games',
        col: '#C2185B'
      },
      // South Gateway to Purana Bazar / Heritage Lane
      {
        x: 0, z: 18, rot: 0,
        title: 'पुराना बाज़ार एवं हीरापुर हेरिटेज लेन',
        subtitle: 'Heritage Courtyard • Dida’s Nostalgic Memories',
        col: '#E65100'
      },
      // West Gateway to Jharudih Craft Lane
      {
        x: -18, z: 0, rot: -Math.PI / 2,
        title: 'झारूडीह शिल्प वाटिका • JHARUDIH CRAFT LANE',
        subtitle: 'Madan da’s Workshop • Bamboo & Clay Artisan Guild',
        col: '#2E7D32'
      }
    ];

    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63, roughness: 0.7 });
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.8 });

    gateways.forEach(g => {
      const arch = new THREE.Group();
      arch.position.set(g.x, 0, g.z);
      arch.rotation.y = g.rot;

      // Two Wooden / Bamboo Pillars
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 7.5, 8), pillarMat);
      p1.position.set(-6.5, 3.75, 0);
      arch.add(p1);

      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 7.5, 8), pillarMat);
      p2.position.set(6.5, 3.75, 0);
      arch.add(p2);

      // Crossbeam
      const beam = new THREE.Mesh(new THREE.BoxGeometry(14, 0.5, 0.6), beamMat);
      beam.position.set(0, 7.2, 0);
      arch.add(beam);

      // Hanging Fabric Banner
      const bannerTex = TextureGenerator.createPujaBannerTexture(g.title, g.subtitle, g.col);
      const bannerMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 2.2),
        new THREE.MeshBasicMaterial({ map: bannerTex, transparent: true })
      );
      bannerMesh.position.set(0, 6.0, 0.05);
      arch.add(bannerMesh);

      // Back of banner
      const bannerBack = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 2.2),
        new THREE.MeshBasicMaterial({ map: bannerTex, transparent: true })
      );
      bannerBack.position.set(0, 6.0, -0.05);
      bannerBack.rotation.y = Math.PI;
      arch.add(bannerBack);

      // Small lantern on each pillar
      [-6.5, 6.5].forEach(lx => {
        const lantern = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0xFFD54F, emissive: 0xFFA000, emissiveIntensity: 0.8 })
        );
        lantern.position.set(lx, 7.6, 0);
        this.festivalClock.registerEmissive(lantern.material);
        arch.add(lantern);
      });

      this.scene.add(arch);
    });
  }

  initCivicHelpdesk() {
    // Dhanbad District Police & Medical Assistance Helpdesk (Near Central Hub North-West)
    const helpdesk = new THREE.Group();
    helpdesk.position.set(-12, 0, 7);

    // Platform & Tent Kiosk
    const tentRoofMat = new THREE.MeshStandardMaterial({ color: 0x1565C0, roughness: 0.6 }); // Police Blue
    const tentRoof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.2, 4), tentRoofMat);
    tentRoof.position.y = 3.2;
    tentRoof.rotation.y = Math.PI / 4;
    helpdesk.add(tentRoof);

    // Support legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0xCFD8DC, metalness: 0.8 });
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2 + Math.PI / 4;
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5, 6), legMat);
      leg.position.set(Math.cos(ang) * 1.5, 1.25, Math.sin(ang) * 1.5);
      helpdesk.add(leg);
    }

    // Helpdesk Counter Desk
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x37474F, roughness: 0.8 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 0.8), deskMat);
    desk.position.set(0, 0.45, 0);
    helpdesk.add(desk);

    // Signboard on Front of Desk
    const signTex = TextureGenerator.createSignboardTexture(
      'धनबाद जिला पुलिस • सहायता केंद्र',
      'POLICE & FIRST AID HELP DESK • 112',
      'blue'
    );
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 0.7),
      new THREE.MeshBasicMaterial({ map: signTex })
    );
    signMesh.position.set(0, 0.5, 0.42);
    helpdesk.add(signMesh);

    // Flashing Civic Beacon Light (Blue / Red LED)
    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.25, 8),
      new THREE.MeshStandardMaterial({ color: 0x2196F3, emissive: 0x1976D2, emissiveIntensity: 1.2 })
    );
    beacon.position.set(0, 3.85, 0);
    this.festivalClock.registerEmissive(beacon.material);
    helpdesk.add(beacon);

    // Crowd control barriers (Yellow-Black striped police barricades)
    const barricadeMat = new THREE.MeshStandardMaterial({ color: 0xFDD835, roughness: 0.6 });
    [-2.2, 2.2].forEach(bx => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.85, 0.1), barricadeMat);
      bar.position.set(bx, 0.42, 1.2);
      helpdesk.add(bar);
    });

    this.scene.add(helpdesk);
  }

  initStreetFoodAndChaiStall() {
    // Roadside Kulhad Chai & Jalebi stall on the south walkway
    const chaiStall = new THREE.Group();
    chaiStall.position.set(11, 0, 14);

    // Wooden cart on iron wheels
    const cartMat = new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.85 });
    const cart = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 1.4), cartMat);
    cart.position.y = 0.55;
    chaiStall.add(cart);

    // Cart Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x212121, metalness: 0.8 });
    [-1.0, 1.0].forEach(wx => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 12), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, 0.35, 0.75);
      chaiStall.add(wheel);

      const wheelBack = wheel.clone();
      wheelBack.position.z = -0.75;
      chaiStall.add(wheelBack);
    });

    // Striped Fabric Canopy (Yellow & Red)
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0xE64A19, roughness: 0.7 });
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 1.6), canopyMat);
    canopy.position.y = 2.4;
    chaiStall.add(canopy);

    // Bamboo canopy poles
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xAFB42B, roughness: 0.6 });
    [-1.1, 1.1].forEach(px => {
      [-0.65, 0.65].forEach(pz => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 6), poleMat);
        pole.position.set(px, 1.6, pz);
        chaiStall.add(pole);
      });
    });

    // Brass Tea Samovar / Kettle
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.85, roughness: 0.25 });
    const kettle = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.5, 12), brassMat);
    kettle.position.set(-0.6, 1.25, 0.2);
    chaiStall.add(kettle);

    // Large Jalebi / Snack Frying Kadhai (Cast iron wok)
    const wokMat = new THREE.MeshStandardMaterial({ color: 0x263238, metalness: 0.9, roughness: 0.3 });
    const wok = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), wokMat);
    wok.position.set(0.4, 1.05, 0);
    wok.rotation.x = Math.PI;
    chaiStall.add(wok);

    // Small incandescent yellow hanging bulb
    const stallBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xFFE082, emissive: 0xFFA000, emissiveIntensity: 0.9 })
    );
    stallBulb.position.set(0, 2.2, 0);
    this.festivalClock.registerEmissive(stallBulb.material);
    chaiStall.add(stallBulb);

    const stallLight = new THREE.PointLight(0xFFB74D, 0.7, 5, 2);
    stallLight.position.set(0, 2.1, 0);
    stallLight.userData.baseIntensity = 0.7;
    this.festivalClock.registerFestivalLight(stallLight);
    chaiStall.add(stallLight);

    // Stall Banner
    const bannerTex = TextureGenerator.createSignboardTexture(
      'कोयलांचल कुल्हड़ चाय • KULHAD CHAI',
      'गर्मा-गर्म जलेबी एवं स्पेशल मसाला चाय',
      'gold'
    );
    const bannerMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 0.55),
      new THREE.MeshBasicMaterial({ map: bannerTex })
    );
    bannerMesh.position.set(0, 0.6, 0.72);
    chaiStall.add(bannerMesh);

    this.scene.add(chaiStall);
  }

  initCityBuildings() {
    this.cityBuildings = new CityBuildings(this.scene, this.festivalClock);
  }

  initArtisanCourtyard() {
    const artisanGroup = new THREE.Group();
    artisanGroup.position.set(-40, 0, 0);

    const shedGeo = new THREE.BoxGeometry(16, 5.5, 13);
    const shedMat = new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.8 });
    const shed = new THREE.Mesh(shedGeo, shedMat);
    shed.position.set(0, 2.75, -4);
    artisanGroup.add(shed);

    const signTex = TextureGenerator.createSignboardTexture(
      'झारूडीह शिल्प वाटिका • JHARUDIH',
      'Artisan Craft Courtyard • Madan da’s Pandal Workshop',
      'gold'
    );
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 2.2),
      new THREE.MeshBasicMaterial({ map: signTex })
    );
    sign.position.set(0, 5.5, 2.6);
    artisanGroup.add(sign);

    const bambooMat = new THREE.MeshStandardMaterial({ color: 0xAFB42B, roughness: 0.6 });
    for (let b = 0; b < 8; b++) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 6.5, 8), bambooMat);
      pole.position.set(-6 + b * 0.45, 0.3 + (b % 2) * 0.2, 4.5);
      pole.rotation.z = Math.PI / 2;
      artisanGroup.add(pole);
    }

    const workLight = new THREE.PointLight(0xFFB300, 1.2, 14, 1.6);
    workLight.position.set(0, 4.5, 0);
    workLight.userData.baseIntensity = 1.2;
    this.festivalClock.registerFestivalLight(workLight);
    artisanGroup.add(workLight);

    this.scene.add(artisanGroup);

    // 3 Collectible Golden Lotuses
    this.spawnLotusCollectible(-36, 1.2, 2, 'lotus_1');
    this.spawnLotusCollectible(-42, 1.2, -8, 'lotus_2');
    this.spawnLotusCollectible(-45, 1.2, 5, 'lotus_3');
  }

  spawnLotusCollectible(x, y, z, id) {
    const lotusGroup = new THREE.Group();
    lotusGroup.position.set(x, y, z);

    const lotusMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      emissive: 0xFFA000,
      emissiveIntensity: 2.2,
      metalness: 0.8,
      roughness: 0.15
    });
    this.festivalClock.registerEmissive(lotusMat);

    for (let p = 0; p < 8; p++) {
      const angle = (p * Math.PI * 2) / 8;
      const petal = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.7, 5), lotusMat);
      petal.position.set(Math.cos(angle) * 0.3, 0.22, Math.sin(angle) * 0.3);
      petal.rotation.z = Math.cos(angle) * 0.45;
      petal.rotation.x = Math.sin(angle) * 0.45;
      lotusGroup.add(petal);
    }

    const itemLight = new THREE.PointLight(0xFFD54F, 1.2, 6);
    itemLight.position.y = 0.5;
    lotusGroup.add(itemLight);

    this.scene.add(lotusGroup);

    this.collectibles.push({
      id: id,
      type: 'lotus_bundle',
      name: 'Golden Lotus Craft Bundle',
      group: lotusGroup,
      collected: false
    });
  }

  initInteractionRings() {
    const stations = [
      { x: 3.5,  z: 4.5,  color: 0x00E5FF, label: 'Aheli' },
      { x: -36,  z: 0,    color: 0x76FF03, label: 'Madan da' },
      { x: 49.5, z: 8,    color: 0xFFD54F, label: 'Imran' },
      { x: 45,   z: 0,    color: 0xFF1744, label: 'Giant Wheel' },
      { x: 29,   z: 6,    color: 0xE040FB, label: 'Rupa' },
      { x: 0,    z: 32,   color: 0xFF9100, label: 'Dida' },
      { x: 0,    z: -71,  color: 0xFFD54F, label: 'Pushpanjali' },
      { x: 61,   z: -1,   color: 0xE040FB, label: 'Dhak Stage' },
      { x: 61,   z: 11,   color: 0x00E5FF, label: 'Ring Toss' }
    ];

    stations.forEach((st) => {
      const ringGeo = new THREE.RingGeometry(1.6, 1.9, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: st.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(st.x, 0.05, st.z);
      this.scene.add(ring);

      this.groundRings.push({
        mesh: ring,
        color: st.color
      });
    });
  }

  initBoundaryAndDecorations() {
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.9 });
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20, roughness: 0.8 });

    const treePositions = [
      [-18, -32], [18, -32], [-18, -50], [18, -50],
      [-16, 18], [16, 18], [-32, 14], [32, 14],
      [-52, -14], [-52, 14], [58, -20], [58, 20]
    ];

    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 4.2, 8), treeTrunkMat);
      trunk.position.y = 2.1;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliage = new THREE.Mesh(new THREE.ConeGeometry(2.6, 5.8, 8), leavesMat);
      foliage.position.y = 5.8;
      foliage.castShadow = true;
      tree.add(foliage);

      this.scene.add(tree);
    });
  }

  initStreetLighting() {
    // Warm Street Lamp Pools along the main walkways to bathe roads in soft light
    const lampPosts = [
      { x: -7, z: -5 },
      { x: 7,  z: -5 },
      { x: -7, z: 12 },
      { x: 7,  z: 12 },
      { x: 22, z: -6 },
      { x: 22, z: 6 },
      { x: -22, z: -5 },
      { x: -22, z: 5 },
      { x: 0,  z: 22 },
      { x: 0,  z: 42 }
    ];

    lampPosts.forEach((lp) => {
      // Cast warm downward light pool onto the road
      const streetLight = new THREE.PointLight(0xFFB300, 1.0, 12, 1.6);
      streetLight.position.set(lp.x, 4.2, lp.z);
      streetLight.userData.baseIntensity = 1.0;
      this.festivalClock.registerFestivalLight(streetLight);
      this.scene.add(streetLight);
    });
  }

  update(delta, time) {
    for (let i = 0; i < this.collectibles.length; i++) {
      const item = this.collectibles[i];
      if (!item.collected) {
        item.group.rotation.y += delta * 2;
        item.group.position.y = 1.0 + Math.sin(time * 3 + i) * 0.2;
      }
    }

    for (let i = 0; i < this.groundRings.length; i++) {
      const r = this.groundRings[i];
      const scale = 1.0 + Math.sin(time * 3.5 + i) * 0.15;
      r.mesh.scale.set(scale, scale, 1);
    }
  }
}
