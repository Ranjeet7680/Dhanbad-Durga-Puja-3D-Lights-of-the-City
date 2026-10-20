import { Localization } from '../core/Localization.js';

export class MiniGameManager {
  constructor(audioDirector, saveManager, hud, hindiVoice) {
    this.audioDirector = audioDirector;
    this.saveManager = saveManager;
    this.hud = hud;
    this.hindiVoice = hindiVoice;

    this.isDhakGameActive = false;
    this.isRingGameActive = false;

    this.initDhakGame();
    this.initRingTossGame();
    this.initPushpanjaliModal();
  }

  // --- 1. DHAK RHYTHM CHALLENGE ---
  initDhakGame() {
    this.dhakModal = document.getElementById('dhak-game-modal');
    this.btnStrike = document.getElementById('btn-dhak-strike');
    this.btnCloseDhak = document.getElementById('btn-close-dhak');
    this.dhakScoreEl = document.getElementById('dhak-score');
    this.dhakStreakEl = document.getElementById('dhak-streak');
    this.dhakFeedbackEl = document.getElementById('dhak-feedback');
    this.dhakTargetRing = document.getElementById('dhak-target-ring');

    this.dhakScore = 0;
    this.dhakStreak = 0;

    if (this.btnStrike) {
      this.btnStrike.addEventListener('click', () => this.strikeDhak());
    }
    if (this.btnCloseDhak) {
      this.btnCloseDhak.addEventListener('click', () => this.closeDhakGame());
    }

    // Space key strike support while playing
    window.addEventListener('keydown', (e) => {
      if (this.isDhakGameActive && e.code === 'Space') {
        e.preventDefault();
        this.strikeDhak();
      }
    });
  }

  openDhakGame() {
    this.isDhakGameActive = true;
    this.dhakScore = 0;
    this.dhakStreak = 0;
    this.dhakModal.classList.remove('hidden');
    this.dhakScoreEl.innerText = '0';
    this.dhakStreakEl.innerText = '0';
    this.dhakFeedbackEl.innerText = Localization.t('dhakGameDesc');

    this.hindiVoice.speakText("ढाक ताल चुनौती में आपका स्वागत है! ताल के साथ समय पर स्पेस दबाएं।");

    this.startDhakBeatLoop();
  }

  closeDhakGame() {
    this.isDhakGameActive = false;
    this.dhakModal.classList.add('hidden');
    if (this.dhakAnimId) cancelAnimationFrame(this.dhakAnimId);

    if (this.dhakScore > 0) {
      const tokensWon = Math.min(150, Math.floor(this.dhakScore / 2));
      this.saveManager.addTokens(tokensWon);
      this.hud.showToast(`ढाक ताल समाप्त! ${tokensWon} उत्सव टोकन अर्जित किए!`);
      this.audioDirector.playFanfare();
    }
  }

  startDhakBeatLoop() {
    const pulseRing = document.getElementById('dhak-pulse-ring');
    let lastBeat = performance.now();
    const beatInterval = 600; // ms per beat

    const loop = (now) => {
      if (!this.isDhakGameActive) return;

      const elapsed = (now - lastBeat) % beatInterval;
      const progress = elapsed / beatInterval;
      const scale = 2.0 - progress * 1.0; // shrinks towards 1.0

      if (pulseRing) {
        pulseRing.style.transform = `scale(${scale})`;
        pulseRing.style.opacity = `${0.3 + progress * 0.7}`;
      }

      this.currentBeatAccuracy = Math.abs(scale - 1.0);

      this.dhakAnimId = requestAnimationFrame(loop);
    };

    this.dhakAnimId = requestAnimationFrame(loop);
  }

  strikeDhak() {
    if (!this.isDhakGameActive) return;

    this.audioDirector.playDhakBass(this.audioDirector.ctx ? this.audioDirector.ctx.currentTime : 0);
    this.audioDirector.playDhakRim(this.audioDirector.ctx ? this.audioDirector.ctx.currentTime + 0.05 : 0);

    const diff = this.currentBeatAccuracy || 0.5;

    if (diff < 0.18) {
      // Perfect
      this.dhakScore += 50;
      this.dhakStreak++;
      this.showDhakFeedback("लाजवाब! PERFECT!", "#76FF03");
      this.audioDirector.playKanshiBell(this.audioDirector.ctx ? this.audioDirector.ctx.currentTime : 0);
    } else if (diff < 0.35) {
      // Good
      this.dhakScore += 25;
      this.dhakStreak++;
      this.showDhakFeedback("बहुत बढ़िया! GOOD!", "#FFD54F");
    } else {
      // Miss
      this.dhakStreak = 0;
      this.showDhakFeedback("चूक गए! MISS", "#FF5252");
    }

    this.dhakScoreEl.innerText = this.dhakScore;
    this.dhakStreakEl.innerText = this.dhakStreak;
  }

  showDhakFeedback(text, color) {
    if (!this.dhakFeedbackEl) return;
    this.dhakFeedbackEl.innerText = text;
    this.dhakFeedbackEl.style.color = color;
    this.dhakFeedbackEl.style.transform = "scale(1.2)";
    setTimeout(() => {
      if (this.dhakFeedbackEl) this.dhakFeedbackEl.style.transform = "scale(1)";
    }, 150);
  }

  // --- 2. FAIRGROUND RING TOSS ---
  initRingTossGame() {
    this.ringModal = document.getElementById('ring-toss-modal');
    this.btnThrowRing = document.getElementById('btn-throw-ring');
    this.btnCloseRing = document.getElementById('btn-close-ring');
    this.ringScoreEl = document.getElementById('ring-score');
    this.ringTriesEl = document.getElementById('ring-tries');
    this.ringFeedbackEl = document.getElementById('ring-feedback');
    this.aimMarker = document.getElementById('ring-aim-marker');

    this.ringScore = 0;
    this.ringTries = 5;

    if (this.btnThrowRing) {
      this.btnThrowRing.addEventListener('click', () => this.throwRing());
    }
    if (this.btnCloseRing) {
      this.btnCloseRing.addEventListener('click', () => this.closeRingGame());
    }
  }

  openRingGame() {
    this.isRingGameActive = true;
    this.ringScore = 0;
    this.ringTries = 5;
    this.ringModal.classList.remove('hidden');
    this.ringScoreEl.innerText = '0';
    this.ringTriesEl.innerText = '5';
    this.ringFeedbackEl.innerText = Localization.t('ringTossDesc');

    this.hindiVoice.speakText("रिंग फेंक खेल में आपका स्वागत है! सही समय पर रिंग फेंकें और खिलौने जीतें।");

    this.startRingAimLoop();
  }

  closeRingGame() {
    this.isRingGameActive = false;
    this.ringModal.classList.add('hidden');
    if (this.ringAnimId) cancelAnimationFrame(this.ringAnimId);

    if (this.ringScore > 0) {
      const tokensWon = this.ringScore;
      this.saveManager.addTokens(tokensWon);
      this.hud.showToast(`रिंग खेल समाप्त! ${tokensWon} टोकन प्राप्त हुए!`);
      this.audioDirector.playFanfare();
    }
  }

  startRingAimLoop() {
    let t = 0;
    const loop = () => {
      if (!this.isRingGameActive) return;
      t += 0.04;
      const xPercent = 50 + Math.sin(t * 2) * 38;
      const yPercent = 50 + Math.cos(t * 1.5) * 28;

      if (this.aimMarker) {
        this.aimMarker.style.left = `${xPercent}%`;
        this.aimMarker.style.top = `${yPercent}%`;
      }

      this.currentAim = { x: xPercent, y: yPercent };
      this.ringAnimId = requestAnimationFrame(loop);
    };
    this.ringAnimId = requestAnimationFrame(loop);
  }

  throwRing() {
    if (!this.isRingGameActive || this.ringTries <= 0) return;

    this.ringTries--;
    this.ringTriesEl.innerText = this.ringTries;

    // Check hit against prize zones:
    // Golden Kalash: near (50, 45)
    // Brass Elephant: near (25, 60)
    // Wooden Doll: near (75, 60)
    const aim = this.currentAim || { x: 50, y: 50 };
    const distKalash = Math.hypot(aim.x - 50, aim.y - 45);
    const distElephant = Math.hypot(aim.x - 25, aim.y - 60);
    const distDoll = Math.hypot(aim.x - 75, aim.y - 60);

    this.audioDirector.playInteractionChime();

    if (distKalash < 12) {
      this.ringScore += 60;
      this.ringFeedbackEl.innerText = "🌟 स्वर्ण कलश पर सटीक निशाना! +60 अंक!";
      this.ringFeedbackEl.style.color = "#FFD54F";
    } else if (distElephant < 14) {
      this.ringScore += 40;
      this.ringFeedbackEl.innerText = "🐘 पीतल का हाथी जीता! +40 अंक!";
      this.ringFeedbackEl.style.color = "#00E5FF";
    } else if (distDoll < 14) {
      this.ringScore += 30;
      this.ringFeedbackEl.innerText = "🪆 सुंदर कठपुतली जीती! +30 अंक!";
      this.ringFeedbackEl.style.color = "#FF4081";
    } else {
      this.ringFeedbackEl.innerText = "रिंग थोड़ा सा फिसल गया! पुनः प्रयास करें।";
      this.ringFeedbackEl.style.color = "#BDBDBD";
    }

    this.ringScoreEl.innerText = this.ringScore;

    if (this.ringTries === 0) {
      setTimeout(() => this.closeRingGame(), 1600);
    }
  }

  // --- 3. PUSHPANJALI & AARTI RITUAL ---
  initPushpanjaliModal() {
    this.anjaliModal = document.getElementById('pushpanjali-modal');
    this.btnOfferFlowers = document.getElementById('btn-offer-flowers');
    this.btnCloseAnjali = document.getElementById('btn-close-anjali');

    if (this.btnOfferFlowers) {
      this.btnOfferFlowers.addEventListener('click', () => this.performOffering());
    }
    if (this.btnCloseAnjali) {
      this.btnCloseAnjali.addEventListener('click', () => {
        this.anjaliModal.classList.add('hidden');
      });
    }
  }

  openPushpanjali() {
    this.anjaliModal.classList.remove('hidden');
    this.hindiVoice.speakText("माँ दुर्गा के श्रीचरणों में पुष्पांजलि अर्पित करें। ॐ जयन्ती मङ्गला काली भद्रकाली कपालिनी।");
  }

  performOffering() {
    this.audioDirector.playFanfare();
    this.audioDirector.playKanshiBell(this.audioDirector.ctx ? this.audioDirector.ctx.currentTime : 0);

    // Drop flower petals animation in HUD
    this.hud.triggerConfetti();
    this.hud.showToast(Localization.t('anjaliDone'));

    this.saveManager.addTokens(100);
    this.saveManager.unlockStamp('housing_pandal');

    this.hindiVoice.speakText("माँ दुर्गा की असीम कृपा आप पर सदैव बनी रहे। शुभ शारदीया!");

    setTimeout(() => {
      this.anjaliModal.classList.add('hidden');
    }, 1800);
  }
}
