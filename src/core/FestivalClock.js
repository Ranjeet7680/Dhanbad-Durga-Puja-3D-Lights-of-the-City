import * as THREE from 'three';

export class FestivalClock {
  constructor(scene, engine) {
    this.scene = scene;
    this.engine = engine;

    this.emissiveMaterials = [];
    this.pointLights = [];
    this.onTimeChangeCallbacks = [];

    // Default time ~18:45 (Twilight Peak Illumination)
    this.timeOfDay = 18.75;
    this.isAutoAdvancing = false;
    this.advanceSpeed = 0.05;

    this.initLights();
  }

  initLights() {
    // Hemispheric ambient light (Warm festival sky + urban street ground bounce)
    this.ambientLight = new THREE.HemisphereLight(0x405578, 0x2E241E, 0.75);
    this.scene.add(this.ambientLight);

    // Directional light (Sun / Moon)
    this.dirLight = new THREE.DirectionalLight(0xFFA726, 1.2);
    this.dirLight.position.set(40, 75, 30);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;
    this.dirLight.shadow.camera.near = 10;
    this.dirLight.shadow.camera.far = 200;
    const d = 80;
    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // Secondary warm ground bounce light
    this.bounceLight = new THREE.DirectionalLight(0xFF8F00, 0.45);
    this.bounceLight.position.set(-30, 25, -30);
    this.scene.add(this.bounceLight);

    this.updateLighting();
  }

  registerEmissive(material) {
    if (!this.emissiveMaterials.includes(material)) {
      this.emissiveMaterials.push(material);
    }
  }

  registerFestivalLight(light) {
    if (!this.pointLights.includes(light)) {
      this.pointLights.push(light);
    }
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
    const nightFactor = Math.max(0, Math.min(1, (t - 17.0) / 2.5));

    // Fog color seamlessly matches the night horizon
    let fogColor;
    if (t < 17.5) {
      const p = (t - 16.5) / 1.0;
      fogColor = new THREE.Color().lerpColors(new THREE.Color(0x3B251D), new THREE.Color(0x151C30), p);
    } else if (t < 19.5) {
      const p = (t - 17.5) / 2.0;
      fogColor = new THREE.Color().lerpColors(new THREE.Color(0x151C30), new THREE.Color(0x0C1222), p);
    } else {
      fogColor = new THREE.Color(0x0A101E);
    }

    if (this.scene.fog) {
      this.scene.fog.color.copy(fogColor);
      this.scene.fog.density = 0.006 + nightFactor * 0.002;
    }

    // Adjust Sun / Moon Directional Light
    if (t < 18.0) {
      this.dirLight.color.setHex(0xFFB04A);
      this.dirLight.intensity = 1.3 - (t - 16.5) * 0.4;
      this.ambientLight.intensity = 0.8 - (t - 16.5) * 0.15;
    } else {
      // Moon & Ambient City Light
      this.dirLight.color.setHex(0x8BA6E8);
      this.dirLight.intensity = 0.55;
      this.ambientLight.intensity = 0.65;
      this.ambientLight.color.setHex(0x324466);
      this.ambientLight.groundColor.setHex(0x281E18);
    }

    // Boost emissive glow of fairy lights and pandals as darkness falls (calibrated to preserve texture fidelity)
    if (this.emissiveMaterials && Array.isArray(this.emissiveMaterials)) {
      const emissiveIntensity = 0.45 + nightFactor * 0.65;
      for (const mat of this.emissiveMaterials) {
        if (mat && mat.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = emissiveIntensity;
        }
      }
    }

    // Scale point lights cleanly
    if (this.pointLights && Array.isArray(this.pointLights)) {
      for (const light of this.pointLights) {
        if (light && light.userData && light.userData.baseIntensity) {
          light.intensity = light.userData.baseIntensity * (0.75 + nightFactor * 0.35);
        }
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
