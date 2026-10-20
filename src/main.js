import * as THREE from 'three';
import { Engine } from './core/Engine.js';
import { InputManager } from './core/InputManager.js';
import { FestivalClock } from './core/FestivalClock.js';
import { AudioDirector } from './core/AudioDirector.js';
import { SaveManager } from './core/SaveManager.js';
import { HindiVoiceDirector } from './core/HindiVoiceDirector.js';
import { Localization } from './core/Localization.js';

import { WorldBuilder } from './world/WorldBuilder.js';
import { CrowdDirector } from './world/CrowdDirector.js';

import { Player } from './entities/Player.js';
import { NPCManager } from './entities/NPC.js';

import { QuestManager } from './gameplay/QuestManager.js';
import { RideSystem } from './gameplay/RideSystem.js';
import { MiniGameManager } from './gameplay/MiniGames.js';

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
    this.hindiVoice = new HindiVoiceDirector();
    this.engine = new Engine(this.container);
    this.input = new InputManager();
    this.festivalClock = new FestivalClock(this.engine.scene, this.engine);

    // UI & Gameplay Managers
    this.hud = new HUD(this.saveManager);
    this.questManager = new QuestManager(this.saveManager, this.audioDirector, this.hud, this.hindiVoice);

    // World & NPCs
    this.worldBuilder = new WorldBuilder(this.engine.scene, this.engine, this.festivalClock);
    this.crowdDirector = new CrowdDirector(this.engine.scene, this.engine);
    this.player = new Player(this.engine.scene, this.engine, this.input);
    this.npcManager = new NPCManager(this.engine.scene, this.engine);

    // Rides & Mini-games
    this.rideSystem = new RideSystem(this.player, this.worldBuilder.megaMela, this.questManager, this.hud);
    this.miniGameManager = new MiniGameManager(this.audioDirector, this.saveManager, this.hud, this.hindiVoice);

    // Modals & Viewports
    this.dialogueBox = new DialogueBox(this.questManager, this.audioDirector, this.rideSystem, this.hindiVoice);
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
      { id: 'hub', name: Localization.t('districtHub'), position: new THREE.Vector3(0, 0, 5), radius: 15, color: '#FFB300' },
      { id: 'tunnel', name: Localization.t('districtTunnel'), position: new THREE.Vector3(0, 0, -32), radius: 18, color: '#E040FB' },
      { id: 'housing_pandal', name: Localization.t('districtPandal'), position: new THREE.Vector3(0, 0, -62), radius: 24, color: '#FF1744' },
      { id: 'mega_mela', name: Localization.t('districtMela'), position: new THREE.Vector3(45, 0, 0), radius: 32, color: '#00E5FF' },
      { id: 'artisan_lane', name: Localization.t('districtArtisan'), position: new THREE.Vector3(-40, 0, 0), radius: 18, color: '#76FF03' },
      { id: 'heritage_lane', name: Localization.t('districtHeritage'), position: new THREE.Vector3(0, 0, 32), radius: 18, color: '#FF9100' }
    ];

    // Interactive Stations
    this.stations = {
      dhakStage: new THREE.Vector3(61, 0, -1),
      ringToss: new THREE.Vector3(61, 0, 11),
      sanctumAltar: new THREE.Vector3(0, 1.2, -71)
    };

    this.currentDistrict = Localization.t('districtHub');

    this.initEvents();
    this.initClockDisplay();
    this.engine.start();

    // Start periodic atmospheric Hindi loudspeaker announcements
    this.hindiVoice.startPeriodicAnnouncements();
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

        // Welcome voice line in Hindi
        this.hindiVoice.speakText("धनबाद दुर्गा पूजा में आपका स्वागत है। सेंट्रल हब में अहेली से मिलें।");
      });
    }

    // Language Toggle Button (Hindi <-> English)
    const btnLang = document.getElementById('btn-lang-toggle');
    if (btnLang) {
      btnLang.addEventListener('click', () => {
        const nextLang = Localization.currentLang === 'hi' ? 'en' : 'hi';
        Localization.setLanguage(nextLang);
        this.hud.applyLocalization();
        this.questManager.updateHUD();
        this.updateLandmarkNames();
        this.hud.showToast(nextLang === 'hi' ? 'भाषा: हिन्दी' : 'Language: English');
      });
    }

    // Voice Narrator Toggle Button
    const btnVoice = document.getElementById('btn-voice-toggle');
    const voiceIcon = document.getElementById('voice-icon');
    const voiceBtnLabel = document.getElementById('voice-btn-label');
    if (btnVoice) {
      btnVoice.addEventListener('click', () => {
        const isVoiceOn = this.hindiVoice.toggleVoice();
        if (voiceIcon) voiceIcon.innerText = isVoiceOn ? '🗣️' : '🔇';
        if (voiceBtnLabel) voiceBtnLabel.innerText = isVoiceOn ? (Localization.currentLang === 'hi' ? 'आवाज़ चालू' : 'Voice On') : (Localization.currentLang === 'hi' ? 'आवाज़ बंद' : 'Voice Off');
        this.hud.showToast(isVoiceOn ? 'हिंदी स्वर: सक्रिय' : 'Hindi Voice: Muted');
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
        if (this.miniGameManager.isDhakGameActive) this.miniGameManager.closeDhakGame();
        if (this.miniGameManager.isRingGameActive) this.miniGameManager.closeRingGame();
      }
    });
  }

  updateLandmarkNames() {
    this.landmarks[0].name = Localization.t('districtHub');
    this.landmarks[1].name = Localization.t('districtTunnel');
    this.landmarks[2].name = Localization.t('districtPandal');
    this.landmarks[3].name = Localization.t('districtMela');
    this.landmarks[4].name = Localization.t('districtArtisan');
    this.landmarks[5].name = Localization.t('districtHeritage');
  }

  initClockDisplay() {
    this.festivalClock.onTimeChange((timeStr, bandStr) => {
      if (this.hud.clockTimeEl) this.hud.clockTimeEl.innerText = timeStr;
      if (this.hud.clockBandEl) {
        const isHi = Localization.currentLang === 'hi';
        let hiBand = bandStr;
        if (bandStr.includes('Dusk')) hiBand = Localization.t('bandDusk');
        else if (bandStr.includes('Blue')) hiBand = Localization.t('bandBlueHour');
        else if (bandStr.includes('Peak')) hiBand = Localization.t('bandPeakNight');
        else if (bandStr.includes('Night')) hiBand = Localization.t('bandMidnight');
        this.hud.clockBandEl.innerText = isHi ? hiBand : bandStr;
      }
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

    // 3. Check if near Dhak Rhythm Stage
    if (playerPos.distanceTo(this.stations.dhakStage) < 5.0) {
      this.miniGameManager.openDhakGame();
      return;
    }

    // 4. Check if near Ring Toss Game Stall
    if (playerPos.distanceTo(this.stations.ringToss) < 5.0) {
      this.miniGameManager.openRingGame();
      return;
    }

    // 5. Check if near Sanctum Altar (Pushpanjali)
    if (playerPos.distanceTo(this.stations.sanctumAltar) < 7.0) {
      this.miniGameManager.openPushpanjali();
      return;
    }

    // 6. Check if near collectible Golden Lotus
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
    let insideDistrict = Localization.currentLang === 'hi' ? 'धनबाद उत्सव प्रांगण' : 'Dhanbad Festival Grounds';
    for (const lm of this.landmarks) {
      const dist = playerPos.distanceTo(lm.position);
      if (dist < lm.radius) {
        insideDistrict = lm.name;
        if (this.saveManager.discoverLandmark(lm.name)) {
          const msg = Localization.currentLang === 'hi'
            ? `📍 नया स्थान खोजा गया: ${lm.name}!`
            : `📍 Discovered Landmark: ${lm.name}!`;
          this.hud.showToast(msg);
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
    if (this.dialogueBox.isOpen || this.passportModal.isOpen || this.photoMode.isActive ||
        this.miniGameManager.isDhakGameActive || this.miniGameManager.isRingGameActive) {
      this.hud.hideInteractionPrompt();
      return;
    }

    const isHi = Localization.currentLang === 'hi';

    // 1. NPC Proximity
    const nearby = this.npcManager.getNearbyNPC(playerPos);
    if (nearby) {
      const name = isHi ? nearby.npc.name : nearby.npc.name.split(' (')[0];
      const prompt = isHi
        ? `${name} से बातचीत करें [E]`
        : `Speak with ${name} [E]`;
      this.hud.showInteractionPrompt(prompt, 'E');
      return;
    }

    // 2. Ferris Wheel Boarding
    if (this.rideSystem.canBoard(playerPos)) {
      if (!this.rideSystem.isRiding) {
        this.hud.showInteractionPrompt(Localization.t('promptBoard'), 'E');
      } else {
        this.hud.showInteractionPrompt(Localization.t('promptExitRide'), 'E');
      }
      return;
    }

    // 3. Dhak Rhythm Challenge
    if (playerPos.distanceTo(this.stations.dhakStage) < 5.0) {
      this.hud.showInteractionPrompt(Localization.t('promptPlayDhak'), 'E');
      return;
    }

    // 4. Ring Toss Game Stall
    if (playerPos.distanceTo(this.stations.ringToss) < 5.0) {
      this.hud.showInteractionPrompt(Localization.t('promptPlayRing'), 'E');
      return;
    }

    // 5. Pushpanjali at Altar
    if (playerPos.distanceTo(this.stations.sanctumAltar) < 7.0) {
      this.hud.showInteractionPrompt(Localization.t('promptAnjali'), 'E');
      return;
    }

    // 6. Collectibles
    for (const c of this.worldBuilder.collectibles) {
      if (!c.collected && playerPos.distanceTo(c.group.position) < 3.0) {
        const itemLabel = isHi ? 'स्वर्ण कमल' : 'Golden Lotus';
        this.hud.showInteractionPrompt(`${Localization.t('promptCollect')} ${itemLabel}`, 'E');
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
