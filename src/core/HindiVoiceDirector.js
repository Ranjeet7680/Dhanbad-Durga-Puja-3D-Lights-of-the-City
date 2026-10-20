export class HindiVoiceDirector {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voices = [];
    this.hindiVoice = null;
    this.isEnabled = true;
    this.isMuted = false;
    this.currentUtterance = null;
    this.announcementInterval = null;

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }

    // Authentic Mela Loudspeaker PA announcements in Hindi
    this.announcements = [
      "सर्वजन ध्यान दें! धनबाद हाउसिंग कॉलोनी दुर्गा पूजा महोत्सव में आप सभी का हार्दिक स्वागत है। कृपया कतार में रहें और स्वच्छता बनाए रखें।",
      "मेगा मेले का जाइंट व्हील झूला और सर्कस प्रारंभ हो चुका है। सभी आगंतुक टिकट काउंटर से टोकन प्राप्त करें।",
      "मां दुर्गा की संध्या महाआरती का समय हो चुका है। श्रद्धालु गर्भगृह में जाकर पुष्पांजलि अर्पित करें।",
      "झारूडीह शिल्प वाटिका में पारंपरिक बांस और जूट की शिल्पकला का प्रदर्शन अवश्य देखें।"
    ];
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();

    // Prefer native Indian Hindi voices
    this.hindiVoice = this.voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi')) ||
                      this.voices.find(v => v.name.toLowerCase().includes('hindi')) ||
                      this.voices.find(v => v.lang === 'en-IN') ||
                      this.voices[0];
  }

  toggleVoice() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
    }
    return this.isEnabled;
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  speakText(text, options = {}) {
    if (!this.isEnabled || !this.synth) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.hindiVoice) {
      utterance.voice = this.hindiVoice;
    }
    utterance.lang = 'hi-IN';
    utterance.pitch = options.pitch !== undefined ? options.pitch : 1.0;
    utterance.rate = options.rate !== undefined ? options.rate : 0.95;
    utterance.volume = options.volume !== undefined ? options.volume : 1.0;

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  speakNPC(npcId, hindiText) {
    if (!this.isEnabled) return;

    // Character voice personality tunings
    let pitch = 1.0;
    let rate = 0.95;

    if (npcId === 'npc_aheli') {
      pitch = 1.15; // Young, cheerful guide
      rate = 1.0;
    } else if (npcId === 'npc_madan') {
      pitch = 0.88; // Deep, calm craftsman
      rate = 0.92;
    } else if (npcId === 'npc_imran') {
      pitch = 1.05; // Energetic ride operator
      rate = 1.05;
    } else if (npcId === 'npc_rupa') {
      pitch = 1.1;  // Warm, lively food vendor
      rate = 0.98;
    } else if (npcId === 'npc_dida') {
      pitch = 0.92; // Gentle, maternal elder cadence
      rate = 0.85;
    }

    this.speakText(hindiText, { pitch, rate });
  }

  startPeriodicAnnouncements() {
    if (this.announcementInterval) clearInterval(this.announcementInterval);

    // Play an announcement every 65 seconds
    this.announcementInterval = setInterval(() => {
      if (!this.isEnabled) return;
      const announcement = this.announcements[Math.floor(Math.random() * this.announcements.length)];
      this.speakText(announcement, { pitch: 0.95, rate: 0.9, volume: 0.85 });
    }, 65000);
  }
}
