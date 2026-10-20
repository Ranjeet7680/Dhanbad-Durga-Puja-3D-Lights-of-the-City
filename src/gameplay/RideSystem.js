import * as THREE from 'three';

export class RideSystem {
  constructor(player, megaMela, questManager, hud) {
    this.player = player;
    this.megaMela = megaMela;
    this.questManager = questManager;
    this.hud = hud;

    this.isRiding = false;
    this.rideTime = 0;
    this.rideDuration = 18; // 18 seconds for a scenic orbit
    this.exitPosition = new THREE.Vector3(45, 0, 4);

    this.initUI();
  }

  initUI() {
    this.rideOverlay = document.getElementById('ride-overlay');
    this.btnExitRide = document.getElementById('btn-skip-ride');
    this.btnCamToggle = document.getElementById('btn-ride-cam-toggle');

    if (this.btnExitRide) {
      this.btnExitRide.addEventListener('click', () => this.exitRide());
    }
  }

  canBoard(playerPosition) {
    // Boarding area is at Mega Mela wheel platform
    const platformPos = new THREE.Vector3(45, 0, 0);
    return playerPosition.distanceTo(platformPos) < 6.5;
  }

  startRide() {
    if (this.isRiding) return;
    this.isRiding = true;
    this.rideTime = 0;

    const { gondola } = this.megaMela.getBoardingGondolaPosition();
    this.player.boardRide(gondola);

    if (this.rideOverlay) {
      this.rideOverlay.classList.remove('hidden');
    }

    this.hud.showToast('Boarded Giant Wheel! Enjoy the Dhanbad skyline.');
  }

  exitRide() {
    if (!this.isRiding) return;
    this.isRiding = false;
    this.player.exitRide(this.exitPosition);

    if (this.rideOverlay) {
      this.rideOverlay.classList.add('hidden');
    }

    // Check if Quest 3 (Courage Light) was active
    if (this.questManager.currentChapter === 3) {
      this.questManager.completeCurrentChapter();
    }
  }

  update(delta) {
    if (!this.isRiding) return;
    this.rideTime += delta;

    // After 1 full scenic cycle, give option or auto exit
    if (this.rideTime >= this.rideDuration) {
      this.hud.showToast('Ride completed! Press E or click Step Down to exit.');
    }
  }
}
