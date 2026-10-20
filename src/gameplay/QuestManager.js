import { Localization } from '../core/Localization.js';

export class QuestManager {
  constructor(saveManager, audioDirector, hud, hindiVoice) {
    this.saveManager = saveManager;
    this.audioDirector = audioDirector;
    this.hud = hud;
    this.hindiVoice = hindiVoice;

    this.currentChapter = this.saveManager.data.currentChapter;
    this.craftCurrentCount = 0;
    this.craftTargetCount = 3;

    this.updateHUD();
  }

  getCurrentQuestData() {
    const isHi = Localization.currentLang === 'hi';
    const c = this.currentChapter;

    if (this.isAllCompleted()) {
      return {
        tag: Localization.t('qCompletedTag'),
        counter: isHi ? '5/5 पूर्ण' : '5/5 Complete',
        title: Localization.t('qCompletedTitle'),
        desc: Localization.t('qCompletedDesc')
      };
    }

    if (c === 1) {
      return {
        tag: Localization.t('q1Tag'),
        counter: isHi ? 'अध्याय 1/5' : 'Chapter 1/5',
        title: Localization.t('q1Title'),
        desc: Localization.t('q1Desc'),
        tokens: 50,
        stampKey: 'hub'
      };
    } else if (c === 2) {
      const desc = isHi
        ? `झारूडीह शिल्प वाटिका में खोए 3 स्वर्ण कमल ढूंढें (${this.craftCurrentCount}/3)`
        : `Find 3 Golden Lotus bundles in Jharudih craft lane (${this.craftCurrentCount}/3)`;
      return {
        tag: Localization.t('q2Tag'),
        counter: isHi ? 'अध्याय 2/5' : 'Chapter 2/5',
        title: Localization.t('q2Title'),
        desc: desc,
        tokens: 100,
        stampKey: 'artisan_lane'
      };
    } else if (c === 3) {
      return {
        tag: Localization.t('q3Tag'),
        counter: isHi ? 'अध्याय 3/5' : 'Chapter 3/5',
        title: Localization.t('q3Title'),
        desc: Localization.t('q3Desc'),
        tokens: 100,
        stampKey: 'mega_mela'
      };
    } else if (c === 4) {
      return {
        tag: Localization.t('q4Tag'),
        counter: isHi ? 'अध्याय 4/5' : 'Chapter 4/5',
        title: Localization.t('q4Title'),
        desc: Localization.t('q4Desc'),
        tokens: 100,
        stampKey: 'housing_pandal'
      };
    } else {
      return {
        tag: Localization.t('q5Tag'),
        counter: isHi ? 'अध्याय 5/5' : 'Chapter 5/5',
        title: Localization.t('q5Title'),
        desc: Localization.t('q5Desc'),
        tokens: 250,
        stampKey: 'heritage_lane'
      };
    }
  }

  updateHUD() {
    const q = this.getCurrentQuestData();
    if (this.hud) {
      this.hud.updateObjective(q.tag, q.counter, q.desc);
    }
  }

  isAllCompleted() {
    return Object.values(this.saveManager.data.lights).every(Boolean);
  }

  progressCraftCollect() {
    this.craftCurrentCount++;
    const isHi = Localization.currentLang === 'hi';

    if (this.craftCurrentCount >= this.craftTargetCount) {
      const msg = isHi
        ? 'तीनों स्वर्ण कमल मिल गए! मदन दा के पास लौटें।'
        : 'Found all 3 Lotuses! Return to Madan da.';
      this.hud.showToast(msg);
      if (this.hindiVoice) {
        this.hindiVoice.speakText(isHi ? "तीनों स्वर्ण कमल मिल गए! मदन दा के पास चलिए।" : "Found all 3 Lotuses!");
      }
    } else {
      const msg = isHi
        ? `स्वर्ण कमल प्राप्त हुआ (${this.craftCurrentCount}/3)`
        : `Collected Golden Lotus (${this.craftCurrentCount}/3)`;
      this.hud.showToast(msg);
    }
    this.updateHUD();
  }

  completeCurrentChapter() {
    const q = this.getCurrentQuestData();
    if (!q) return;

    let lightKey = 'welcome';
    if (this.currentChapter === 1) lightKey = 'welcome';
    if (this.currentChapter === 2) lightKey = 'craft';
    if (this.currentChapter === 3) lightKey = 'courage';
    if (this.currentChapter === 4) lightKey = 'community';
    if (this.currentChapter === 5) lightKey = 'home';

    this.saveManager.completeLight(lightKey);
    if (q.stampKey) {
      this.saveManager.unlockStamp(q.stampKey);
    }
    if (q.tokens) {
      this.saveManager.addTokens(q.tokens);
    }

    this.audioDirector.playFanfare();
    this.hud.showCelebration(q.tag);

    if (this.currentChapter < 5) {
      this.currentChapter++;
      this.saveManager.data.currentChapter = this.currentChapter;
      this.saveManager.save();
    }

    this.updateHUD();
  }
}
