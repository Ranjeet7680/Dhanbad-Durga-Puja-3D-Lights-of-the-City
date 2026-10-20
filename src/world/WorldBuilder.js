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

    this.lightTunnel = new LightTunnel(this.scene, this.festivalClock);
    this.engine.addUpdatable(this.lightTunnel);

    this.housingPandal = new HousingColonyPandal(this.scene, this.festivalClock);
    this.engine.addUpdatable(this.housingPandal);

    this.megaMela = new MegaMela(this.scene, this.festivalClock);
    this.engine.addUpdatable(this.megaMela);
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

    const workLight = new THREE.PointLight(0xFFB300, 1.8, 18);
    workLight.position.set(0, 4.5, 0);
    workLight.userData.baseIntensity = 1.8;
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
      const streetLight = new THREE.PointLight(0xFFB300, 1.5, 14);
      streetLight.position.set(lp.x, 4.2, lp.z);
      streetLight.userData.baseIntensity = 1.5;
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
