import * as THREE from 'three';

export class Player {
  constructor(scene, engine, inputManager) {
    this.scene = scene;
    this.engine = engine;
    this.input = inputManager;

    // Kinematics & state
    this.position = new THREE.Vector3(0, 0, 10);
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.isGrounded = true;
    this.walkSpeed = 5.2;
    this.runSpeed = 9.5;
    this.jumpForce = 7.2;
    this.gravity = 18.0;

    this.isOnRide = false;
    this.rideGondola = null;

    // Camera follow parameters
    this.cameraDistance = 5.2;
    this.cameraHeight = 2.2;
    this.targetCameraPos = new THREE.Vector3();

    this.createMesh();
  }

  createMesh() {
    this.group = new THREE.Group();
    this.group.position.copy(this.position);

    // Realistic PBR Materials for Festival Attire
    const kurtaMat = new THREE.MeshStandardMaterial({
      color: 0xEE7700, // Vibrant festive Saffron Orange
      roughness: 0.55,
      metalness: 0.1
    });

    const scarfMat = new THREE.MeshStandardMaterial({
      color: 0x991B1B, // Royal Crimson Angavastram / Dupatta
      roughness: 0.65,
      metalness: 0.05
    });

    const goldBorderMat = new THREE.MeshStandardMaterial({
      color: 0xFFD54F,
      metalness: 0.8,
      roughness: 0.25
    });

    const churidarMat = new THREE.MeshStandardMaterial({
      color: 0xFDFDFD, // Crisp White Churidar Trousers
      roughness: 0.8
    });

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xD09572, // Warm Indian skin tone
      roughness: 0.75
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x181210, // Dark brown/black hair
      roughness: 0.9
    });

    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x3E2723, // Traditional leather mojari
      roughness: 0.4
    });

    // 1. Torso & Kurta Body (Contoured, natural human proportions)
    this.torso = new THREE.Group();
    this.torso.position.y = 1.15;

    // Chest & Waist
    const chestGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.65, 12);
    const chest = new THREE.Mesh(chestGeo, kurtaMat);
    chest.castShadow = true;
    this.torso.add(chest);

    // Kurta Hem Skirt (A-line flare below waist)
    const skirtGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.45, 12);
    const skirt = new THREE.Mesh(skirtGeo, kurtaMat);
    skirt.position.y = -0.45;
    skirt.castShadow = true;
    this.torso.add(skirt);

    // Gold embroidered collar & placket
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.20, 0.12, 12),
      goldBorderMat
    );
    collar.position.y = 0.34;
    this.torso.add(collar);

    const placket = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.35, 0.02),
      goldBorderMat
    );
    placket.position.set(0, 0.15, 0.26);
    this.torso.add(placket);

    // 2. Festive Scarf (Angavastram / Dupatta) draped over left shoulder
    const scarf = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.9, 0.55),
      scarfMat
    );
    scarf.position.set(-0.22, 0.1, 0.02);
    scarf.rotation.z = 0.15;
    this.torso.add(scarf);

    this.group.add(this.torso);

    // 3. Head & Face
    this.head = new THREE.Group();
    this.head.position.y = 1.78;

    const headMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      skinMat
    );
    headMesh.scale.set(1.0, 1.15, 1.05);
    headMesh.castShadow = true;
    this.head.add(headMesh);

    // Styled Hair
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.21, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8),
      hairMat
    );
    hair.position.set(0, 0.04, -0.02);
    this.head.add(hair);

    this.group.add(this.head);

    // 4. Arms (Upper arm + Forearm)
    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.65, 8);

    // Left Arm
    this.leftArm = new THREE.Mesh(armGeo, kurtaMat);
    this.leftArm.position.set(-0.36, 1.25, 0);
    this.leftArm.castShadow = true;
    this.group.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Mesh(armGeo, kurtaMat);
    this.rightArm.position.set(0.36, 1.25, 0);
    this.rightArm.castShadow = true;
    this.group.add(this.rightArm);

    // 5. Legs (White Churidar) & Mojari Shoes
    const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.72, 8);

    // Left Leg
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.14, 0.72, 0);

    const lLeg = new THREE.Mesh(legGeo, churidarMat);
    lLeg.position.y = -0.36;
    lLeg.castShadow = true;
    this.leftLegGroup.add(lLeg);

    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.26), shoeMat);
    lShoe.position.set(0, -0.68, 0.06);
    this.leftLegGroup.add(lShoe);
    this.group.add(this.leftLegGroup);

    // Right Leg
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.14, 0.72, 0);

    const rLeg = new THREE.Mesh(legGeo, churidarMat);
    rLeg.position.y = -0.36;
    rLeg.castShadow = true;
    this.rightLegGroup.add(rLeg);

    const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.26), shoeMat);
    rShoe.position.set(0, -0.68, 0.06);
    this.rightLegGroup.add(rShoe);
    this.group.add(this.rightLegGroup);

    // 6. Flashlight / Torch Beam illuminating ground ahead
    this.playerTorch = new THREE.SpotLight(0xFFE082, 1.6, 22, Math.PI / 5, 0.45);
    this.playerTorch.position.set(0, 1.5, 0.3);
    this.playerTorch.target.position.set(0, 0, 12);
    this.group.add(this.playerTorch);
    this.group.add(this.playerTorch.target);

    this.scene.add(this.group);

    this.animTime = 0;
  }

  teleport(x, y, z) {
    this.position.set(x, y, z);
    this.group.position.copy(this.position);
    this.velocity.set(0, 0, 0);
  }

  boardRide(gondola) {
    this.isOnRide = true;
    this.rideGondola = gondola;
    this.group.visible = false;
  }

  exitRide(exitPos) {
    this.isOnRide = false;
    this.rideGondola = null;
    this.group.visible = true;
    this.teleport(exitPos.x, exitPos.y, exitPos.z);
  }

  update(delta, time) {
    if (this.isOnRide && this.rideGondola) {
      const gondolaWorldPos = new THREE.Vector3();
      this.rideGondola.getWorldPosition(gondolaWorldPos);
      this.position.copy(gondolaWorldPos);

      const cam = this.engine.camera;
      cam.position.set(
        gondolaWorldPos.x - 9,
        gondolaWorldPos.y + 2.5,
        gondolaWorldPos.z + 14
      );
      cam.lookAt(0, 10, -45);
      return;
    }

    this.input.updateMovement();
    const move = this.input.moveVector;
    const isMoving = move.lengthSq() > 0.01;

    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.input.cameraYaw);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.input.cameraYaw);

    const speed = this.input.isSprinting ? this.runSpeed : this.walkSpeed;

    if (isMoving) {
      const moveDir = new THREE.Vector3()
        .addScaledVector(right, move.x)
        .addScaledVector(forward, move.y)
        .normalize();

      this.velocity.x = moveDir.x * speed;
      this.velocity.z = moveDir.z * speed;

      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      this.group.rotation.y = targetAngle;
    } else {
      this.velocity.x *= 0.6;
      this.velocity.z *= 0.6;
    }

    if (this.input.jumpRequested && this.isGrounded) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.velocity.y -= this.gravity * delta;
    }

    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.position.z += this.velocity.z * delta;

    if (this.position.y <= 0) {
      this.position.y = 0;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    this.group.position.copy(this.position);

    // Walk / Run Cycle Animation
    if (isMoving && this.isGrounded) {
      const animSpeed = this.input.isSprinting ? 14 : 9.5;
      this.animTime += delta * animSpeed;
      const legSwing = Math.sin(this.animTime) * 0.65;
      const armSwing = Math.sin(this.animTime) * 0.5;

      this.leftLegGroup.rotation.x = legSwing;
      this.rightLegGroup.rotation.x = -legSwing;
      this.leftArm.rotation.x = -armSwing;
      this.rightArm.rotation.x = armSwing;

      // Kurta torso sway and subtle bob
      this.torso.position.y = 1.15 + Math.abs(Math.sin(this.animTime * 2)) * 0.05;
      this.torso.rotation.y = Math.sin(this.animTime) * 0.08;
    } else {
      // Idle natural breathing
      this.animTime += delta * 2;
      this.leftLegGroup.rotation.x = 0;
      this.rightLegGroup.rotation.x = 0;
      this.leftArm.rotation.x = Math.sin(this.animTime) * 0.04;
      this.rightArm.rotation.x = -Math.sin(this.animTime) * 0.04;
      this.torso.position.y = 1.15 + Math.sin(this.animTime) * 0.015;
      this.torso.rotation.y = 0;
    }

    this.updateCamera(delta);
  }

  updateCamera(delta) {
    const cam = this.engine.camera;
    const yaw = this.input.cameraYaw;
    const pitch = this.input.cameraPitch;

    const targetLook = new THREE.Vector3(
      this.position.x,
      this.position.y + this.cameraHeight,
      this.position.z
    );

    const cosPitch = Math.cos(pitch);
    const offsetX = Math.sin(yaw) * cosPitch * this.cameraDistance;
    const offsetY = Math.sin(pitch) * this.cameraDistance;
    const offsetZ = Math.cos(yaw) * cosPitch * this.cameraDistance;

    this.targetCameraPos.set(
      targetLook.x + offsetX,
      targetLook.y + offsetY,
      targetLook.z + offsetZ
    );

    if (this.targetCameraPos.y < 0.6) {
      this.targetCameraPos.y = 0.6;
    }

    cam.position.lerp(this.targetCameraPos, 0.28);
    cam.lookAt(targetLook);
  }
}
