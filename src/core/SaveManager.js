export class SaveManager {
  constructor() {
    this.STORAGE_KEY = 'dhanbad_durga_puja_save_v1';
    this.data = this.load();
  }

  getDefaults() {
    return {
      tokens: 0,
      stamps: {
        hub: false,
        housing_pandal: false,
        mega_mela: false,
        artisan_lane: false,
        heritage_lane: false
      },
      lights: {
        welcome: false,
        craft: false,
        courage: false,
        community: false,
        home: false
      },
      currentChapter: 1,
      discoveredLandmarks: [],
      collectedMemories: [],
      settings: {
        timeOfDay: 18.75,
        volume: 0.7,
        crowdDensity: 'high',
        reducedMotion: false
      }
    };
  }

  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        return Object.assign(this.getDefaults(), JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Could not read save state:', e);
    }
    return this.getDefaults();
  }

  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Could not write save state:', e);
    }
  }

  addTokens(amount) {
    this.data.tokens += amount;
    this.save();
    return this.data.tokens;
  }

  unlockStamp(stampKey) {
    if (!this.data.stamps[stampKey]) {
      this.data.stamps[stampKey] = true;
      this.save();
      return true;
    }
    return false;
  }

  completeLight(lightKey) {
    if (!this.data.lights[lightKey]) {
      this.data.lights[lightKey] = true;
      this.data.currentChapter = Math.min(5, this.data.currentChapter + 1);
      this.save();
      return true;
    }
    return false;
  }

  discoverLandmark(name) {
    if (!this.data.discoveredLandmarks.includes(name)) {
      this.data.discoveredLandmarks.push(name);
      this.save();
      return true;
    }
    return false;
  }
}
