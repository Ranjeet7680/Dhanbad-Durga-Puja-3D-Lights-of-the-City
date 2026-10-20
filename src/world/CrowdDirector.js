import * as THREE from 'three';

export class CrowdDirector {
  constructor(scene, engine) {
    this.scene = scene;
    this.engine = engine;
    this.agents = [];
    this.densityMode = 'high'; // 'low', 'medium', 'high'

    // Walkway waypoints for crowd wandering
    this.waypoints = [
      new THREE.Vector3(0, 0, 5),     // Central Hub
      new THREE.Vector3(0, 0, -12),   // Tunnel Entrance
      new THREE.Vector3(0, 0, -48),   // Pandal Entrance
      new THREE.Vector3(-6, 0, -56),  // Pandal Courtyard Left
      new THREE.Vector3(6, 0, -56),   // Pandal Courtyard Right
      new THREE.Vector3(20, 0, 2),    // Mela Road
      new THREE.Vector3(45, 0, -2),   // Mela Entrance
      new THREE.Vector3(45, 0, -14),  // Near Ferris Wheel
      new THREE.Vector3(45, 0, 14),   // Near Carousel
      new THREE.Vector3(32, 0, 4),    // Food Lane
      new THREE.Vector3(-18, 0, 0),   // Jharudih Road
      new THREE.Vector3(-36, 0, 2),   // Artisan Shed
      new THREE.Vector3(0, 0, 25)     // Purana Bazar / South
    ];

    this.spawnCrowd();
  }

  spawnCrowd() {
    // Clear existing
    for (const a of this.agents) {
      this.scene.remove(a.mesh);
    }
    this.agents = [];

    const targetCount = this.densityMode === 'low' ? 8 : (this.densityMode === 'medium' ? 18 : 34);

    const festiveColors = [
      0xE65100, 0xFFB300, 0xC2185B, 0x1E88E5,
      0x43A047, 0x8E24AA, 0xFF7043, 0xD4E157, 0xFFFFFF
    ];

    for (let i = 0; i < targetCount; i++) {
      const agent = this.createAgentMesh(festiveColors[i % festiveColors.length]);
      // Pick random initial waypoint
      const startWp = this.waypoints[Math.floor(Math.random() * this.waypoints.length)];
      agent.mesh.position.set(
        startWp.x + (Math.random() - 0.5) * 6,
        0,
        startWp.z + (Math.random() - 0.5) * 6
      );

      this.scene.add(agent.mesh);

      this.agents.push({
        mesh: agent.mesh,
        leftLeg: agent.leftLeg,
        rightLeg: agent.rightLeg,
        leftArm: agent.leftArm,
        rightArm: agent.rightArm,
        target: this.pickRandomWaypoint(startWp),
        speed: 1.2 + Math.random() * 0.8,
        pauseTimer: Math.random() * 3,
        animTime: Math.random() * 10
      });
    }
  }

  createAgentMesh(clothingColor) {
    const group = new THREE.Group();

    // Body / Kurta or Saree
    const bodyMat = new THREE.MeshStandardMaterial({ color: clothingColor, roughness: 0.6 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xD7A07E, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1A1412, roughness: 0.9 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.7 });

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.75, 8);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    torso.position.y = 1.15;
    group.add(torso);

    // Head
    const headGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.7;
    group.add(head);

    // Hair
    const hairGeo = new THREE.SphereGeometry(0.19, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.74;
    group.add(hair);

    // Limbs
    const limbMat = pantsMat;
    const legGeo = new THREE.BoxGeometry(0.12, 0.75, 0.12);

    const leftLeg = new THREE.Mesh(legGeo, limbMat);
    leftLeg.position.set(-0.12, 0.4, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, limbMat);
    rightLeg.position.set(0.12, 0.4, 0);
    group.add(rightLeg);

    const armGeo = new THREE.BoxGeometry(0.1, 0.6, 0.1);
    const leftArm = new THREE.Mesh(armGeo, bodyMat);
    leftArm.position.set(-0.35, 1.1, 0);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, bodyMat);
    rightArm.position.set(0.35, 1.1, 0);
    group.add(rightArm);

    return { mesh: group, leftLeg, rightLeg, leftArm, rightArm };
  }

  pickRandomWaypoint(exclude) {
    let candidate;
    do {
      candidate = this.waypoints[Math.floor(Math.random() * this.waypoints.length)];
    } while (candidate === exclude);
    return candidate;
  }

  setDensity(mode) {
    if (this.densityMode !== mode) {
      this.densityMode = mode;
      this.spawnCrowd();
    }
  }

  update(delta) {
    for (let i = 0; i < this.agents.length; i++) {
      const a = this.agents[i];

      if (a.pauseTimer > 0) {
        a.pauseTimer -= delta;
        // Idle pose
        a.leftLeg.rotation.x = 0;
        a.rightLeg.rotation.x = 0;
        a.leftArm.rotation.x = 0;
        a.rightArm.rotation.x = 0;
        continue;
      }

      // Move toward target
      const dx = a.target.x - a.mesh.position.x;
      const dz = a.target.z - a.mesh.position.z;
      const dist = Math.hypot(dx, dz);

      if (dist < 2.5) {
        // Reached destination, pause and choose new waypoint
        a.pauseTimer = 3 + Math.random() * 5;
        a.target = this.pickRandomWaypoint(a.target);
        continue;
      }

      // Move & rotate towards target
      const angle = Math.atan2(dx, dz);
      a.mesh.rotation.y = angle;

      const step = a.speed * delta;
      a.mesh.position.x += (dx / dist) * step;
      a.mesh.position.z += (dz / dist) * step;

      // Animate walk cycle
      a.animTime += delta * a.speed * 6;
      const swing = Math.sin(a.animTime) * 0.6;
      a.leftLeg.rotation.x = swing;
      a.rightLeg.rotation.x = -swing;
      a.leftArm.rotation.x = -swing;
      a.rightArm.rotation.x = swing;
    }
  }
}
