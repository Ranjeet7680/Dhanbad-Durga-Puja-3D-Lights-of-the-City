import * as THREE from 'three';
import { TextureGenerator } from './TextureGenerator.js';
import { CentralHub } from './CentralHub.js';
import { LightTunnel } from './LightTunnel.js';
import { HousingColonyPandal } from './HousingColonyPandal.js';
import { MegaMela } from './MegaMela.js';

export class WorldBuilder {
  constructor(scene, engine, festivalClock) {
    this.scene = scene;
    this.engine = engine;
    this.festivalClock = festivalClock;

    this.collectibles = [];
    this.treeInstances = [];
    this.buntingFlags = [];

    this.initTerrain();
    this.initRoads();
    this.initSubsystems();
    this.initArtisanCourtyard();
    this.initBoundaryAndDecorations();
  }

  initTerrain() {
    // Vast ground terrain
    const terrainGeo = new THREE.PlaneGeometry(240, 240, 32, 32);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x181F1A, // Deep twilight festival park ground
      roughness: 0.9,
      metalness: 0.05
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
      roughness: 0.8
    });

    // 1. North Road: Central Hub (z=0) -> Light Tunnel -> Housing Colony Pandal (z=-65)
    const northRoadGeo = new THREE.PlaneGeometry(10, 70);
    const northRoad = new THREE.Mesh(northRoadGeo, roadMat);
    northRoad.rotation.x = -Math.PI / 2;
    northRoad.position.set(0, 0.01, -35);
    northRoad.receiveShadow = true;
    this.scene.add(northRoad);

    // 2. East Road: Central Hub (x=0) -> Mega Mela (x=45)
    const eastRoadGeo = new THREE.PlaneGeometry(45, 9);
    const eastRoad = new THREE.Mesh(eastRoadGeo, roadMat);
    eastRoad.rotation.x = -Math.PI / 2;
    eastRoad.position.set(22.5, 0.01, 0);
    eastRoad.receiveShadow = true;
    this.scene.add(eastRoad);

    // 3. West Road: Central Hub -> Artisan Lane / Jharudih (x=-40)
    const westRoadGeo = new THREE.PlaneGeometry(40, 8);
    const westRoad = new THREE.Mesh(westRoadGeo, roadMat);
    westRoad.rotation.x = -Math.PI / 2;
    westRoad.position.set(-20, 0.01, 0);
    westRoad.receiveShadow = true;
    this.scene.add(westRoad);

    // 4. South Road: Central Hub -> Purana Bazar & Hirapur Heritage Lane (z=40)
    const southRoadGeo = new THREE.PlaneGeometry(9, 45);
    const southRoad = new THREE.Mesh(southRoadGeo, roadMat);
    southRoad.rotation.x = -Math.PI / 2;
    southRoad.position.set(0, 0.01, 22.5);
    southRoad.receiveShadow = true;
    this.scene.add(southRoad);
  }

  initSubsystems() {
    // Central Festival Hub
    this.centralHub = new CentralHub(this.scene, this.festivalClock);

    // Arched Light Tunnel
    this.lightTunnel = new LightTunnel(this.scene, this.festivalClock);
    this.engine.addUpdatable(this.lightTunnel);

    // Housing Colony Pandal (P0 Hero)
    this.housingPandal = new HousingColonyPandal(this.scene, this.festivalClock);
    this.engine.addUpdatable(this.housingPandal);

    // Mega Mela (Jhula & Rides)
    this.megaMela = new MegaMela(this.scene, this.festivalClock);
    this.engine.addUpdatable(this.megaMela);
  }

  initArtisanCourtyard() {
    // Jharudih Artisan Lane & Craft Courtyard (x = -40, z = 0)
    const artisanGroup = new THREE.Group();
    artisanGroup.position.set(-40, 0, 0);

    // Workshop Pavilion
    const shedGeo = new THREE.BoxGeometry(16, 5, 12);
    const shedMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.8 });
    const shed = new THREE.Mesh(shedGeo, shedMat);
    shed.position.set(0, 2.5, -4);
    artisanGroup.add(shed);

    // Banner
    const signTex = TextureGenerator.createSignboardTexture(
      'झारूडीह शिल्प वाटिका • JHARUDIH',
      'Artisan Craft Courtyard • Madan da’s Pandal Workshop',
      'gold'
    );
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 2.0),
      new THREE.MeshBasicMaterial({ map: signTex })
    );
    sign.position.set(0, 5.2, 2.1);
    artisanGroup.add(sign);

    // Artisan benches & bamboo stacks
    const bambooMat = new THREE.MeshStandardMaterial({ color: 0xAFB42B, roughness: 0.6 });
    for (let b = 0; b < 6; b++) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 6, 8), bambooMat);
      pole.position.set(-6 + b * 0.4, 0.3 + (b % 2) * 0.2, 4);
      pole.rotation.z = Math.PI / 2;
      artisanGroup.add(pole);
    }

    // Warm work lamp
    const workLight = new THREE.PointLight(0xFFB300, 1.4, 15);
    workLight.position.set(0, 4.2, 0);
    workLight.userData.baseIntensity = 1.4;
    this.festivalClock.registerFestivalLight(workLight);
    artisanGroup.add(workLight);

    this.scene.add(artisanGroup);

    // 3 Collectible Golden Lotus Bundles for Craft Light Quest
    this.spawnLotusCollectible(-36, 1.2, 2, 'lotus_1');
    this.spawnLotusCollectible(-42, 1.2, -8, 'lotus_2');
    this.spawnLotusCollectible(-45, 1.2, 5, 'lotus_3');
  }

  spawnLotusCollectible(x, y, z, id) {
    const lotusGroup = new THREE.Group();
    lotusGroup.position.set(x, y, z);

    // Glowing Golden Lotus Flower
    const lotusMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      emissive: 0xFFA000,
      emissiveIntensity: 1.8,
      metalness: 0.7,
      roughness: 0.2
    });
    this.festivalClock.registerEmissive(lotusMat);

    // 6 Lotus petals
    for (let p = 0; p < 6; p++) {
      const angle = (p * Math.PI * 2) / 6;
      const petal = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 5), lotusMat);
      petal.position.set(Math.cos(angle) * 0.25, 0.2, Math.sin(angle) * 0.25);
      petal.rotation.z = Math.cos(angle) * 0.4;
      petal.rotation.x = Math.sin(angle) * 0.4;
      lotusGroup.add(petal);
    }

    // Hovering point light
    const itemLight = new THREE.PointLight(0xFFD54F, 0.8, 4);
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

  initBoundaryAndDecorations() {
    // Perimeter Festive Trees
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.9 });
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20, roughness: 0.8 });

    const treePositions = [
      [-25, -25], [-15, -45], [15, -45], [25, -25],
      [-20, 25], [20, 25], [-35, 20], [35, 20],
      [-55, -20], [-55, 20], [60, -25], [60, 25]
    ];

    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.5, 4, 8), treeTrunkMat);
      trunk.position.y = 2;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliage = new THREE.Mesh(new THREE.ConeGeometry(2.4, 5.5, 8), leavesMat);
      foliage.position.y = 5.5;
      foliage.castShadow = true;
      tree.add(foliage);

      this.scene.add(tree);
    });

    // Festive fluttering triangular bunting flags across the main street
    const flagGeo = new THREE.ConeGeometry(0.35, 0.6, 3);
    const flagColors = [0xFF1744, 0xFFEA00, 0x00E5FF, 0x76FF03, 0xD500F9];

    for (let b = 0; b < 24; b++) {
      const col = flagColors[b % flagColors.length];
      const flagMat = new THREE.MeshBasicMaterial({ color: col });
      const flag = new THREE.Mesh(flagGeo, flagMat);
      flag.rotation.x = Math.PI;
      flag.position.set((Math.random() - 0.5) * 8, 4.8 + Math.sin(b * 0.5) * 0.3, -5 - b * 2.2);
      this.scene.add(flag);
      this.buntingFlags.push(flag);
    }
  }

  update(delta, time) {
    // Bob and rotate collectible items
    for (let i = 0; i < this.collectibles.length; i++) {
      const item = this.collectibles[i];
      if (!item.collected) {
        item.group.rotation.y += delta * 2;
        item.group.position.y = 1.0 + Math.sin(time * 3 + i) * 0.2;
      }
    }

    // Flutter bunting flags
    for (let i = 0; i < this.buntingFlags.length; i++) {
      this.buntingFlags[i].rotation.z = Math.sin(time * 4 + i) * 0.2;
    }
  }
}
