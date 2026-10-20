export class PassportModal {
  constructor(saveManager, audioDirector) {
    this.saveManager = saveManager;
    this.audioDirector = audioDirector;

    this.modal = document.getElementById('passport-modal');
    this.btnClose = document.getElementById('btn-close-passport');
    this.stampsGrid = document.getElementById('stamps-grid');
    this.lightsList = document.getElementById('lights-list');
    this.progressFill = document.getElementById('passport-progress-fill');
    this.progressText = document.getElementById('passport-progress-text');

    this.isOpen = false;

    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }
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
    this.audioDirector.playInteractionChime();
    this.render();
  }

  close() {
    this.isOpen = false;
    this.modal.classList.add('hidden');
  }

  render() {
    const stampsData = [
      { key: 'hub', name: 'Central Festival Hub', date: 'Welcome Toran', graphic: '🪔' },
      { key: 'housing_pandal', name: 'Housing Colony Pandal', date: 'Grand Spectacle', graphic: '🏛️' },
      { key: 'mega_mela', name: 'Dhanbad Mega Mela', date: 'Jhula & Fairground', graphic: '🎡' },
      { key: 'artisan_lane', name: 'Jharudih Craft Court', date: 'Bamboo & Fabric Art', graphic: '🪷' },
      { key: 'heritage_lane', name: 'Heritage Lane', date: 'Oral History', graphic: '🏮' }
    ];

    const lightsData = [
      { key: 'welcome', name: 'The Welcome Light', desc: 'Guide newcomers and celebrate community arrival.', icon: '🌟' },
      { key: 'craft', name: 'The Craft Light', desc: 'Preserve traditional bamboo pandal engineering.', icon: '🪷' },
      { key: 'courage', name: 'The Courage Light', desc: 'Ascend to the skies on the Giant Wheel.', icon: '🎡' },
      { key: 'community', name: 'The Community Light', desc: 'Share festive warmth and culinary sweetness.', icon: '🍯' },
      { key: 'home', name: 'The Home Light', desc: 'Remember the roots and memories that unite Dhanbad.', icon: '🏮' }
    ];

    // Render Stamps
    this.stampsGrid.innerHTML = '';
    let unlockedStampsCount = 0;

    stampsData.forEach((s) => {
      const isUnlocked = !!this.saveManager.data.stamps[s.key];
      if (isUnlocked) unlockedStampsCount++;

      const slot = document.createElement('div');
      slot.className = `stamp-slot ${isUnlocked ? 'unlocked' : ''}`;
      slot.innerHTML = `
        <div class="stamp-graphic">${s.graphic}</div>
        <div class="stamp-name">${s.name}</div>
        <div class="stamp-date">${isUnlocked ? 'VISITED & VERIFIED' : 'UNDISCOVERED'}</div>
      `;
      this.stampsGrid.appendChild(slot);
    });

    // Render 5 Lights
    this.lightsList.innerHTML = '';
    let litCount = 0;

    lightsData.forEach((l) => {
      const isLit = !!this.saveManager.data.lights[l.key];
      if (isLit) litCount++;

      const card = document.createElement('div');
      card.className = `light-card ${isLit ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="light-icon">${l.icon}</div>
        <div class="light-details">
          <div class="light-title">${l.name} ${isLit ? '✓' : ''}</div>
          <div class="light-sub">${l.desc}</div>
        </div>
      `;
      this.lightsList.appendChild(card);
    });

    // Progress Bar
    const totalItems = stampsData.length + lightsData.length;
    const progressPercent = Math.round(((unlockedStampsCount + litCount) / totalItems) * 100);
    this.progressFill.style.width = `${progressPercent}%`;
    this.progressText.innerText = `${progressPercent}% Completed • ${unlockedStampsCount}/5 Stamps • ${litCount}/5 Lights`;
  }
}
