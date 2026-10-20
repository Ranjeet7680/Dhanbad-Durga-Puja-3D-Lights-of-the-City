export class AudioDirector {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.dhakGain = null;
    this.ambientGain = null;
    this.sfxGain = null;

    this.isPlayingDhak = false;
    this.dhakInterval = null;
    this.beatIndex = 0;
    this.tempo = 140; // BPM for lively Durga Puja Dhak beat
    this.isInitialized = false;

    // Authentic Dhak pattern:
    // Dha: deep bass resonant strike
    // Tak / Tin: crisp rim / wood strike
    // Kanshi: brass bell chime
    this.rhythmPattern = [
      { dhak: 'bass', kanshi: true },
      { dhak: 'rim',  kanshi: false },
      { dhak: 'rim',  kanshi: false },
      { dhak: 'rim',  kanshi: true },
      { dhak: 'bass', kanshi: false },
      { dhak: 'rim',  kanshi: true },
      { dhak: 'bass', kanshi: false },
      { dhak: 'flourish', kanshi: true }
    ];
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Dhak Sub-Gain
      this.dhakGain = this.ctx.createGain();
      this.dhakGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.dhakGain.connect(this.masterGain);

      // Ambient Sub-Gain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      // SFX Sub-Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.isInitialized = true;
      this.startAmbience();
      this.startDhakRhythm();
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  resumeIfSuspended() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    if (!this.isInitialized) {
      this.init();
      return true;
    }
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  setVolume(val) {
    if (!this.masterGain || this.isMuted) return;
    this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
  }

  // Adjust Dhak volume based on player distance to Pandal / Dhak stage
  updateDhakProximity(distanceToPandal) {
    if (!this.dhakGain || !this.ctx || this.isMuted) return;
    // Max volume within 15 units, tapering down to 0.1 at 120 units
    const normalized = Math.max(0.12, Math.min(0.85, 1.0 - (distanceToPandal - 15) / 105));
    this.dhakGain.gain.setTargetAtTime(normalized, this.ctx.currentTime, 0.2);
  }

  startDhakRhythm() {
    if (this.dhakInterval) clearInterval(this.dhakInterval);
    const intervalMs = (60 / this.tempo) * 1000 * 0.5; // Eighth notes

    this.dhakInterval = setInterval(() => {
      if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
      const step = this.rhythmPattern[this.beatIndex % this.rhythmPattern.length];
      const now = this.ctx.currentTime;

      if (step.dhak === 'bass') {
        this.playDhakBass(now);
      } else if (step.dhak === 'rim') {
        this.playDhakRim(now);
      } else if (step.dhak === 'flourish') {
        this.playDhakBass(now);
        this.playDhakRim(now + 0.08);
      }

      if (step.kanshi) {
        this.playKanshiBell(now);
      }

      this.beatIndex++;
    }, intervalMs);
  }

  // Deep resonant Bengali Dhak bass hit
  playDhakBass(time) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.18);

    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(this.dhakGain);

    osc.start(time);
    osc.stop(time + 0.28);
  }

  // Crisp wooden rim strike of Dhak
  playDhakRim(time) {
    // Noise burst + resonant bandpass
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, time);
    filter.Q.setValueAtTime(3, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.dhakGain);

    noise.start(time);
    noise.stop(time + 0.07);
  }

  // Traditional Kanshi (brass bell chime)
  playKanshiBell(time) {
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2450, time);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3680, time);

    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.dhakGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + 0.36);
    osc2.stop(time + 0.36);
  }

  // Ambient night soundbed (soft crickets & wind)
  startAmbience() {
    // Generate pink noise / gentle festival murmur
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.02;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(400, this.ctx.currentTime);

      noise.connect(lowpass);
      lowpass.connect(this.ambientGain);
      noise.start();
    } catch (e) {
      console.warn('Ambience init issue:', e);
    }
  }

  // UI / SFX: Interaction ding
  playInteractionChime() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // UI / SFX: Camera Shutter Click
  playCameraShutter() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Mechanical snap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.1);

    // Click rebound
    setTimeout(() => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1100, t);
      osc2.frequency.exponentialRampToValueAtTime(200, t + 0.05);

      gain2.gain.setValueAtTime(0.4, t);
      gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.06);

      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(t);
      osc2.stop(t + 0.08);
    }, 90);
  }

  // Celebration quest fanfare
  playFanfare() {
    if (!this.ctx || this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    notes.forEach((freq, idx) => {
      const time = this.ctx.currentTime + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(time);
      osc.stop(time + 0.4);
    });
  }
}
