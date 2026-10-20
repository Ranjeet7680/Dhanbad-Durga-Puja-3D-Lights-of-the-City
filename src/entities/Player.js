import * as THREE from 'three';

export class Player {
  constructor(scene, engine, inputManager) {
    this.scene = scene;
    this.engine = engine;
    this.input = inputManager;

    // Player position and kinematics
    this.position = new THREE.Vector3(0, 0, 10); // Spawns near Central Hub
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.isGrounded = true;
    this.walkSpeed = 5.0;
    this.runSpeed = 9.0;
    this.jumpForce = 7.0;
    this.gravity = 18.0;

    // Ride state (if player is on the Ferris Wheel)
    this.isOnRide = false;
    this.rideGondola = null;

    // Camera parameters
    this.cameraDistance = 5.5;
    this.cameraHeight = 2.4;
    this.targetCameraPos = new THREE.Vector3();

    // Interaction target
    this.currentInteractable = null;

    this.createMesh();
  }

  createMesh() {
    this.group = new THREE.Group();
    this.group.position.copy(this.position);

    // Stylized Indian festival attire (Saffron/Gold Kurta + White Pajama)
    const kurtaMat = new THREE.MeshStandardMaterial({
      color: 0xF57C00, // Vibrant saffron orange
      roughness: 0.6
    });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xD7A07E, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1A1412, roughness: 0.9 });
    const pajamaMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.7 });

    // Torso / Kurta
    const torsoGeo = new THREE.CylinderGeometry(0.28, 0.35, 0.85, 8);
    this.torso = new THREE.Mesh(torsoGeo, kurtaMat);
    this.torso.position.y = 1.25;
    this.torso.castShadow = true;
    this.group.add(this.torso);

    // Decorative Nehru jacket vest
    const vestGeo = new THREE.CylinderGeometry(0.3, 0.36, 0.65, 8);
    const vestMat = new THREE.MeshStandardMaterial({ color: 0x880E4F, roughness: 0.5 });
    const vest = new THREE.Mesh(vestGeo, vestMat);
    vest.position.y = 1.32;
    this.group.add(vest);

    // Head
    const headGeo = new THREE.SphereGeometry(0.22, 12, 12);
    this.head = new THREE.Mesh(headGeo, skinMat);
    this.head.position.y = 1.88;
    this.head.castShadow = true;
    this.group.add(this.head);

    // Hair
    const hairGeo = new THREE.SphereGeometry(0.23, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 1.92;
    this.group.add(hair);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.15, 0.85, 0.15);
    this.leftLeg = new THREE.Mesh(legGeo, pajamaMat);
    this.leftLeg.position.set(-0.16, 0.45, 0);
    this.leftLeg.castShadow = true;
    this.group.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, pajamaMat);
    this.rightLeg.position.set(0.16, 0.45, 0);
    this.rightLeg.castShadow = true;
    this.group.add(this.rightLeg);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.12, 0.7, 0.12);
    this.leftArm = new THREE.Mesh(armGeo, kurtaMat);
    this.leftArm.position.set(-0.42, 1.25, 0);
    this.leftArm.castShadow = true;
    this.group.add(this.leftArm);

    this.rightArm = new THREE.Mesh(armGeo, kurtaMat);
    this.rightArm.position.set(0.42, 1.25, 0);
    this.rightArm.castShadow = true;
    this.group.add(this.rightArm);

    // Flashlight / lantern beam for evening exploration
    this.playerTorch = new THREE.SpotLight(0xFFE082, 1.2, 18, Math.PI / 6, 0.5);
    this.playerTorch.position.set(0, 1.4, 0.2);
    this.playerTorch.target.position.set(0, 0, 10);
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
    this.group.visible = false; // Hide player avatar while inside gondola
  }

  exitRide(exitPos) {
    this.isOnRide = false;
    this.rideGondola = null;
    this.group.visible = true;
    this.teleport(exitPos.x, exitPos.y, exitPos.z);
  }

  update(delta, time) {
    if (this.isOnRide && this.rideGondola) {
      // Camera locks to gondola for scenic sky ride
      const gondolaWorldPos = new THREE.Vector3();
      this.rideGondola.getWorldPosition(gondolaWorldPos);
      this.position.copy(gondolaWorldPos);

      // Camera positioned slightly behind gondola looking out towards pandals
      const cam = this.engine.camera;
      cam.position.set(
        gondolaWorldPos.x - 8,
        gondolaWorldPos.y + 2,
        gondolaWorldPos.z + 12
      );
      cam.lookAt(0, 8, -40); // Looks toward the illuminated Housing Colony Pandal
      return;
    }

    // Normal locomotion
    this.input.updateMovement();
    const move = this.input.moveVector;
    const isMoving = move.lengthSq() > 0.01;

    // Movement relative to camera yaw
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

      // Face movement direction smoothly
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      this.group.rotation.y = targetAngle;
    } else {
      this.velocity.x *= 0.6;
      this.velocity.z *= 0.6;
    }

    // Jump / Gravity
    if (this.input.jumpRequested && this.isGrounded) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.velocity.y -= this.gravity * delta;
    }

    // Apply kinematics
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;
    this.position.z += this.velocity.z * delta;

    // Simple floor collision (flat festival grounds y = 0)
    if (this.position.y <= 0) {
      this.position.y = 0;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    this.group.position.copy(this.position);

    // Walk / Run Cycle Animation
    if (isMoving && this.isGrounded) {
      const animSpeed = this.input.isSprinting ? 14 : 9;
      this.animTime += delta * animSpeed;
      const legSwing = Math.sin(this.animTime) * 0.7;
      const armSwing = Math.sin(this.animTime) * 0.5;

      this.leftLeg.rotation.x = legSwing;
      this.rightLeg.rotation.x = -legSwing;
      this.leftArm.rotation.x = -armSwing;
      this.rightArm.rotation.x = armSwing;

      // Subtle bob
      this.torso.position.y = 1.25 + Math.abs(Math.sin(this.animTime * 2)) * 0.06;
    } else {
      // Idle breathing
      this.animTime += delta * 2;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = Math.sin(this.animTime) * 0.05;
      this.rightArm.rotation.x = -Math.sin(this.animTime) * 0.05;
      this.torso.position.y = 1.25;
    }

    // Orbit Camera Follow
    this.updateCamera(delta);
  }

  updateCamera(delta) {
    const cam = this.engine.camera;
    const yaw = this.input.cameraYaw;
    const pitch = this.input.cameraPitch;

    // Spherical coordinates around player head
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

    // Prevent camera from dipping underground
    if (this.targetCameraPos.y < 0.5) {
      this.targetCameraPos.y = 0.5;
    }

    // Smooth camera damping
    cam.position.lerp(this.targetCameraPos, 0.25);
    cam.lookAt(targetLook);
  }
}
