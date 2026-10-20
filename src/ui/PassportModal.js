import { Localization } from '../core/Localization.js';

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
    const isHi = Localization.currentLang === 'hi';

    const stampsData = [
      { key: 'hub', name: isHi ? 'केंद्रीय उत्सव हब' : 'Central Festival Hub', date: isHi ? 'तोरण द्वार दर्शन' : 'Welcome Toran', graphic: '🪔' },
      { key: 'housing_pandal', name: isHi ? 'हाउसिंग कॉलोनी भव्य पंडाल' : 'Housing Colony Pandal', date: isHi ? 'पुष्पांजलि एवं दर्शन' : 'Grand Spectacle', graphic: '🏛️' },
      { key: 'mega_mela', name: isHi ? 'धनबाद मेगा मेला' : 'Dhanbad Mega Mela', date: isHi ? 'झूला एवं खेल स्टॉल' : 'Jhula & Fairground', graphic: '🎡' },
      { key: 'artisan_lane', name: isHi ? 'झारूडीह शिल्प वाटिका' : 'Jharudih Craft Court', date: isHi ? 'शिल्प दर्शन' : 'Bamboo & Fabric Art', graphic: '🪷' },
      { key: 'heritage_lane', name: isHi ? 'हेरिटेज लेन (पुराना बाजार)' : 'Heritage Lane', date: isHi ? 'स्मृति धरोहर' : 'Oral History', graphic: '🏮' }
    ];

    const lightsData = [
      { key: 'welcome', name: isHi ? 'स्वागत दीप (Welcome Light)' : 'The Welcome Light', desc: isHi ? 'नए आगंतुकों का स्वागत एवं उत्सव प्रवेश।' : 'Guide newcomers and celebrate community arrival.', icon: '🌟' },
      { key: 'craft', name: isHi ? 'शिल्प दीप (Craft Light)' : 'The Craft Light', desc: isHi ? 'पारंपरिक बाँस और कपड़े की कारीगरी का संरक्षण।' : 'Preserve traditional bamboo pandal engineering.', icon: '🪷' },
      { key: 'courage', name: isHi ? 'साहस दीप (Courage Light)' : 'The Courage Light', desc: isHi ? 'विशाल जाइंट व्हील के शिखर से विहंगम दर्शन।' : 'Ascend to the skies on the Giant Wheel.', icon: '🎡' },
      { key: 'community', name: isHi ? 'मिठास दीप (Community Light)' : 'The Community Light', desc: isHi ? 'गरम जलेबियों की मिठास और स्वयंसेवक सेवा।' : 'Share festive warmth and culinary sweetness.', icon: '🍯' },
      { key: 'home', name: isHi ? 'गृह दीप (Home Light)' : 'The Home Light', desc: isHi ? 'धनबाद के कोयलांचल वासियों की एकता और स्मृतियाँ।' : 'Remember the roots and memories that unite Dhanbad.', icon: '🏮' }
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
        <div class="stamp-date">${isUnlocked ? Localization.t('stampVisited') : Localization.t('stampUndiscovered')}</div>
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
    const progressLabel = isHi
      ? `${progressPercent}% पूर्ण • ${unlockedStampsCount}/5 मुहरें • ${litCount}/5 दीप`
      : `${progressPercent}% Complete • ${unlockedStampsCount}/5 Stamps • ${litCount}/5 Lights`;
    this.progressText.innerText = progressLabel;
  }
}
