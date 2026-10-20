import * as THREE from 'three';
import { Engine } from './core/Engine.js';
import { InputManager } from './core/InputManager.js';
import { FestivalClock } from './core/FestivalClock.js';
import { AudioDirector } from './core/AudioDirector.js';
import { SaveManager } from './core/SaveManager.js';

import { WorldBuilder } from './world/WorldBuilder.js';
import { CrowdDirector } from './world/CrowdDirector.js';

import { Player } from './entities/Player.js';
import { NPCManager } from './entities/NPC.js';

import { QuestManager } from './gameplay/QuestManager.js';
import { RideSystem } from './gameplay/RideSystem.js';

import { HUD } from './ui/HUD.js';
import { DialogueBox } from './ui/DialogueBox.js';
import { PassportModal } from './ui/PassportModal.js';
import { PhotoMode } from './ui/PhotoMode.js';
import { SettingsModal } from './ui/SettingsModal.js';

class GameApp {
  constructor() {
    this.container = document.getElementById('game-container');

    // Core Systems
    this.saveManager = new SaveManager();
    this.audioDirector = new AudioDirector();
    this.engine = new Engine(this.container);
    this.input = new InputManager();
    this.festivalClock = new FestivalClock(this.engine.scene, this.engine);

    // UI Systems
    this.hud = new HUD(this.saveManager);
    this.questManager = new QuestManager(this.saveManager, this.audioDirector, this.hud);

    // World & NPCs
    this.worldBuilder = new WorldBuilder(this.engine.scene, this.engine, this.festivalClock);
    this.crowdDirector = new CrowdDirector(this.engine.scene, this.engine);
    this.player = new Player(this.engine.scene, this.engine, this.input);
    this.npcManager = new NPCManager(this.engine.scene, this.engine);

    // Gameplay & Rides
    this.rideSystem = new RideSystem(this.player, this.worldBuilder.megaMela, this.questManager, this.hud);

    // Dialogues & Modals
    this.dialogueBox = new DialogueBox(this.questManager, this.audioDirector, this.rideSystem);
    this.passportModal = new PassportModal(this.saveManager, this.audioDirector);
    this.photoMode = new PhotoMode(this.engine, this.audioDirector, this.hud);
    this.settingsModal = new SettingsModal(this.festivalClock, this.audioDirector, this.crowdDirector, this.saveManager);

    // Register engine updatables
    this.engine.addUpdatable(this.festivalClock);
    this.engine.addUpdatable(this.worldBuilder);
    this.engine.addUpdatable(this.crowdDirector);
    this.engine.addUpdatable(this.player);
    this.engine.addUpdatable(this.npcManager);
    this.engine.addUpdatable(this.rideSystem);
    this.engine.addUpdatable(this);

    // Defined Landmarks for Radar & Location detection
    this.landmarks = [
      { id: 'hub', name: 'Central Hub', position: new THREE.Vector3(0, 0, 5), radius: 15, color: '#FFB300' },
      { id: 'tunnel', name: 'Light Tunnel', position: new THREE.Vector3(0, 0, -32), radius: 18, color: '#E040FB' },
      { id: 'housing_pandal', name: 'Housing Colony Pandal', position: new THREE.Vector3(0, 0, -62), radius: 24, color: '#FF1744' },
      { id: 'mega_mela', name: 'Mega Mela & Jhula', position: new THREE.Vector3(45, 0, 0), radius: 32, color: '#00E5FF' },
      { id: 'artisan_lane', name: 'Jharudih Craft Court', position: new THREE.Vector3(-40, 0, 0), radius: 18, color: '#76FF03' },
      { id: 'heritage_lane', name: 'Heritage Lane', position: new THREE.Vector3(0, 0, 32), radius: 18, color: '#FF9100' }
    ];

    this.currentDistrict = 'Central Festival Hub';

    this.initEvents();
    this.initClockDisplay();
    this.engine.start();
  }

  initEvents() {
    // Intro start button
    const btnStart = document.getElementById('btn-start-game');
    const introScreen = document.getElementById('intro-screen');
    if (btnStart && introScreen) {
      btnStart.addEventListener('click', () => {
        introScreen.style.opacity = '0';
        setTimeout(() => introScreen.remove(), 400);
        this.audioDirector.init();
      });
    }

    // Top action buttons
    const btnPassport = document.getElementById('btn-passport');
    if (btnPassport) {
      btnPassport.addEventListener('click', () => this.passportModal.toggle());
    }

    const btnPhoto = document.getElementById('btn-photo');
    if (btnPhoto) {
      btnPhoto.addEventListener('click', () => this.photoMode.toggle(this.currentDistrict));
    }

    const btnAudio = document.getElementById('btn-audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        const isSoundOn = this.audioDirector.toggleMute();
        if (audioIcon) audioIcon.innerText = isSoundOn ? '🔊' : '🔇';
      });
    }

    const btnSettings = document.getElementById('btn-settings');
    if (btnSettings) {
      btnSettings.addEventListener('click', () => this.settingsModal.toggle());
    }

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't trigger if dialogue choices or inputs focused
      if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;

      if (e.code === 'KeyE') {
        this.handleInteraction();
      } else if (e.code === 'KeyP') {
        this.photoMode.toggle(this.currentDistrict);
      } else if (e.code === 'KeyJ') {
        this.passportModal.toggle();
      } else if (e.code === 'KeyM') {
        const isSoundOn = this.audioDirector.toggleMute();
        const icon = document.getElementById('audio-icon');
        if (icon) icon.innerText = isSoundOn ? '🔊' : '🔇';
      } else if (e.code === 'KeyO') {
        this.settingsModal.toggle();
      } else if (e.code === 'Escape') {
        if (this.dialogueBox.isOpen) this.dialogueBox.close();
        if (this.passportModal.isOpen) this.passportModal.close();
        if (this.photoMode.isActive) this.photoMode.exit();
        if (this.settingsModal.isOpen) this.settingsModal.close();
      }
    });
  }

  initClockDisplay() {
    this.festivalClock.onTimeChange((timeStr, bandStr) => {
      if (this.hud.clockTimeEl) this.hud.clockTimeEl.innerText = timeStr;
      if (this.hud.clockBandEl) this.hud.clockBandEl.innerText = bandStr;
    });
  }

  handleInteraction() {
    const playerPos = this.player.position;

    // 1. Check if talking to NPC
    const nearby = this.npcManager.getNearbyNPC(playerPos);
    if (nearby) {
      this.dialogueBox.open(nearby.npc);
      return;
    }

    // 2. Check if near Ferris wheel boarding platform
    if (this.rideSystem.canBoard(playerPos)) {
      if (!this.rideSystem.isRiding) {
        this.rideSystem.startRide();
      } else {
        this.rideSystem.exitRide();
      }
      return;
    }

    // 3. Check if near collectible Golden Lotus
    for (let i = 0; i < this.worldBuilder.collectibles.length; i++) {
      const c = this.worldBuilder.collectibles[i];
      if (!c.collected && playerPos.distanceTo(c.group.position) < 3.0) {
        c.collected = true;
        c.group.visible = false;
        this.audioDirector.playInteractionChime();
        this.questManager.progressCraftCollect();
        return;
      }
    }
  }

  update(delta, time) {
    const playerPos = this.player.position;

    // Update district name & check landmark discovery
    let insideDistrict = 'Dhanbad Festival Grounds';
    for (const lm of this.landmarks) {
      const dist = playerPos.distanceTo(lm.position);
      if (dist < lm.radius) {
        insideDistrict = lm.name;
        // Check discovery
        if (this.saveManager.discoverLandmark(lm.name)) {
          this.hud.showToast(`📍 Discovered Landmark: ${lm.name}!`);
          this.audioDirector.playInteractionChime();
        }
        break;
      }
    }
    this.currentDistrict = insideDistrict;
    this.hud.updateDistrict(insideDistrict);

    // Update Dhak sound volume based on proximity to Housing Colony Pandal (z = -62)
    const distToPandal = playerPos.distanceTo(new THREE.Vector3(0, 0, -62));
    this.audioDirector.updateDhakProximity(distToPandal);

    // Update Context Interaction Prompts
    this.updateContextPrompts(playerPos);

    // Update Radar Minimap
    this.hud.renderMinimap(playerPos, this.input.cameraYaw, this.landmarks);
  }

  updateContextPrompts(playerPos) {
    // If dialogue or modal open, hide prompt
    if (this.dialogueBox.isOpen || this.passportModal.isOpen || this.photoMode.isActive) {
      this.hud.hideInteractionPrompt();
      return;
    }

    // Check NPC proximity
    const nearby = this.npcManager.getNearbyNPC(playerPos);
    if (nearby) {
      this.hud.showInteractionPrompt(`Speak with ${nearby.npc.name} (${nearby.npc.role})`, 'E');
      return;
    }

    // Check Ferris Wheel Boarding
    if (this.rideSystem.canBoard(playerPos)) {
      if (!this.rideSystem.isRiding) {
        this.hud.showInteractionPrompt('Board Giant Wheel (Jhula) [Ride]', 'E');
      } else {
        this.hud.showInteractionPrompt('Step Down from Ride [Exit]', 'E');
      }
      return;
    }

    // Check Collectibles
    for (const c of this.worldBuilder.collectibles) {
      if (!c.collected && playerPos.distanceTo(c.group.position) < 3.0) {
        this.hud.showInteractionPrompt(`Collect ${c.name}`, 'E');
        return;
      }
    }

    this.hud.hideInteractionPrompt();
  }
}

// Launch on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
