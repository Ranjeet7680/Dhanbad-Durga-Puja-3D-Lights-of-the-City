import * as THREE from 'three';

export class FestivalClock {
  constructor(scene, engine) {
    this.scene = scene;
    this.engine = engine;

    // Time is represented in 24h decimal, e.g. 18.5 = 18:30
    this.timeOfDay = 18.75; // Starts at ~18:45 (Twilight / Peak festival illumination)
    this.isAutoAdvancing = false;
    this.advanceSpeed = 0.05; // hours per real second if auto-advancing

    // Setup Sky & Lighting
    this.initLights();

    // Registry of emissive festival objects to intensify at night
    this.emissiveMaterials = [];
    this.pointLights = [];

    this.onTimeChangeCallbacks = [];
  }

  initLights() {
    // Hemispheric ambient light
    this.ambientLight = new THREE.HemisphereLight(0xffeedd, 0x1a243b, 0.6);
    this.scene.add(this.ambientLight);

    // Main directional light (Sun / Moon)
    this.dirLight = new THREE.DirectionalLight(0xffa726, 1.2);
    this.dirLight.position.set(40, 60, 30);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 160;
    const d = 60;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // Warm secondary bounce light
    this.bounceLight = new THREE.DirectionalLight(0xff6f00, 0.4);
    this.bounceLight.position.set(-30, 20, -30);
    this.scene.add(this.bounceLight);

    this.updateLighting();
  }

  registerEmissive(material) {
    this.emissiveMaterials.push(material);
  }

  registerFestivalLight(light) {
    this.pointLights.push(light);
  }

  setTime(hours) {
    this.timeOfDay = Math.max(16.5, Math.min(23.0, hours));
    this.updateLighting();
    this.notifyTimeChange();
  }

  onTimeChange(callback) {
    this.onTimeChangeCallbacks.push(callback);
    callback(this.getTimeString(), this.getTimeBand());
  }

  notifyTimeChange() {
    const timeStr = this.getTimeString();
    const bandStr = this.getTimeBand();
    for (const cb of this.onTimeChangeCallbacks) {
      cb(timeStr, bandStr);
    }
  }

  getTimeString() {
    const hours = Math.floor(this.timeOfDay);
    const minutes = Math.floor((this.timeOfDay - hours) * 60);
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${mm}`;
  }

  getTimeBand() {
    if (this.timeOfDay < 17.5) {
      return 'Dusk Preparation';
    } else if (this.timeOfDay < 19.0) {
      return 'Blue Hour Reveal';
    } else if (this.timeOfDay < 21.5) {
      return 'Peak Festival Spectacle';
    } else {
      return 'Night Panorama';
    }
  }

  updateLighting() {
    const t = this.timeOfDay;
    // Map time [16.5 ... 23.0] to a normalized night factor [0 = daytime/dusk, 1 = midnight]
    const nightFactor = Math.max(0, Math.min(1, (t - 17.0) / 2.5));

    // Sky and fog color interpolation
    // Dusk: warm orange/gold 0x3d2729 -> Blue Hour: 0x121b36 -> Peak night: 0x070b16
    let skyColor, fogColor, groundAmbient;
    if (t < 17.5) {
      const p = (t - 16.5) / 1.0;
      skyColor = new THREE.Color().lerpColors(new THREE.Color(0xd27538), new THREE.Color(0x353565), p);
      fogColor = new THREE.Color().lerpColors(new THREE.Color(0x6e3c27), new THREE.Color(0x19223e), p);
      groundAmbient = 0x3d241e;
    } else if (t < 19.5) {
      const p = (t - 17.5) / 2.0;
      skyColor = new THREE.Color().lerpColors(new THREE.Color(0x232958), new THREE.Color(0x0a1024), p);
      fogColor = new THREE.Color().lerpColors(new THREE.Color(0x151c38), new THREE.Color(0x0a0f1d), p);
      groundAmbient = 0x1a2138;
    } else {
      skyColor = new THREE.Color(0x070b16);
      fogColor = new THREE.Color(0x070a14);
      groundAmbient = 0x0f1524;
    }

    if (this.scene.background instanceof THREE.Color) {
      this.scene.background.copy(skyColor);
    } else {
      this.scene.background = skyColor;
    }

    if (this.scene.fog) {
      this.scene.fog.color.copy(fogColor);
      this.scene.fog.density = 0.007 + nightFactor * 0.003;
    }

    // Adjust Sun / Moon Directional Light
    if (t < 18.0) {
      // Golden Hour Sun
      this.dirLight.color.setHex(0xffaa44);
      this.dirLight.intensity = 1.3 - (t - 16.5) * 0.5;
      this.ambientLight.intensity = 0.7 - (t - 16.5) * 0.2;
    } else {
      // Moonlight & Ambient City Glow
      this.dirLight.color.setHex(0x7c94d8);
      this.dirLight.intensity = 0.35;
      this.ambientLight.intensity = 0.45;
    }

    // Boost emissive glow of fairy lights and pandals as darkness falls
    const emissiveIntensity = 0.3 + nightFactor * 1.5;
    for (const mat of this.emissiveMaterials) {
      if (mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = emissiveIntensity;
      }
    }

    // Scale point lights
    for (const light of this.pointLights) {
      if (light.userData.baseIntensity) {
        light.intensity = light.userData.baseIntensity * (0.4 + nightFactor * 0.8);
      }
    }
  }

  update(delta) {
    if (this.isAutoAdvancing) {
      this.timeOfDay += delta * this.advanceSpeed;
      if (this.timeOfDay > 23.0) {
        this.timeOfDay = 16.5;
      }
      this.updateLighting();
      this.notifyTimeChange();
    }
  }
}
