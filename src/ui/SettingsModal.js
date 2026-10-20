export class SettingsModal {
  constructor(festivalClock, audioDirector, crowdDirector, saveManager) {
    this.festivalClock = festivalClock;
    this.audioDirector = audioDirector;
    this.crowdDirector = crowdDirector;
    this.saveManager = saveManager;

    this.modal = document.getElementById('settings-modal');
    this.btnClose = document.getElementById('btn-close-settings');
    this.btnApply = document.getElementById('btn-save-settings');

    this.timeSlider = document.getElementById('time-slider');
    this.timeLabel = document.getElementById('settings-time-label');
    this.presetButtons = document.querySelectorAll('.time-preset-btn');

    this.volumeSlider = document.getElementById('volume-slider');
    this.volumeLabel = document.getElementById('settings-volume-label');

    this.crowdRadios = document.querySelectorAll('input[name="crowd-density"]');
    this.reducedMotionCheck = document.getElementById('check-reduced-motion');

    this.isOpen = false;

    this.initEvents();
  }

  initEvents() {
    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }
    if (this.btnApply) {
      this.btnApply.addEventListener('click', () => this.close());
    }

    // Time Slider
    if (this.timeSlider) {
      this.timeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.festivalClock.setTime(val);
        this.updateTimeLabel(val);
      });
    }

    // Time Presets
    this.presetButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = parseFloat(btn.dataset.time);
        if (this.timeSlider) this.timeSlider.value = val;
        this.festivalClock.setTime(val);
        this.updateTimeLabel(val);

        this.presetButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Volume Slider
    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.audioDirector.setVolume(val);
        if (this.volumeLabel) {
          this.volumeLabel.innerText = `${Math.round(val * 100)}%`;
        }
      });
    }

    // Crowd Density Radios
    this.crowdRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.crowdDirector.setDensity(e.target.value);
          this.saveManager.data.settings.crowdDensity = e.target.value;
          this.saveManager.save();
        }
      });
    });

    // Reduced Motion
    if (this.reducedMotionCheck) {
      this.reducedMotionCheck.addEventListener('change', (e) => {
        this.saveManager.data.settings.reducedMotion = e.target.checked;
        this.saveManager.save();
      });
    }
  }

  updateTimeLabel(val) {
    if (!this.timeLabel) return;
    const hours = Math.floor(val);
    const mins = Math.floor((val - hours) * 60);
    const mm = mins < 10 ? `0${mins}` : `${mins}`;
    this.timeLabel.innerText = `${hours}:${mm} (${this.festivalClock.getTimeBand()})`;
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.modal.classList.remove('hidden');
    if (this.timeSlider) {
      this.timeSlider.value = this.festivalClock.timeOfDay;
      this.updateTimeLabel(this.festivalClock.timeOfDay);
    }
  }

  close() {
    this.isOpen = false;
    this.modal.classList.add('hidden');
  }
}
