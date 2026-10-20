export class QuestManager {
  constructor(saveManager, audioDirector, hud) {
    this.saveManager = saveManager;
    this.audioDirector = audioDirector;
    this.hud = hud;

    this.quests = {
      1: {
        id: 'qst_welcome',
        lightName: '🌟 Welcome Light',
        title: 'Arrival in Dhanbad',
        objective: 'Meet Aheli at the Central Festival Hub to receive your Pandal Passport.',
        npcId: 'npc_aheli',
        completed: this.saveManager.data.lights.welcome,
        tokens: 50,
        stampKey: 'hub'
      },
      2: {
        id: 'qst_craft',
        lightName: '🪷 Craft Light',
        title: 'Artisan Traditions of Jharudih',
        objective: 'Find 3 Golden Lotus bundles scattered around the Jharudih craft workshop.',
        npcId: 'npc_madan',
        targetCount: 3,
        currentCount: 0,
        completed: this.saveManager.data.lights.craft,
        tokens: 100,
        stampKey: 'artisan_lane'
      },
      3: {
        id: 'qst_courage',
        lightName: '🎡 Courage of the Sky',
        title: 'Panorama of the Mega Mela',
        objective: 'Head East to the Mega Mela and ride the Giant Wheel (Jhula) with Imran.',
        npcId: 'npc_imran',
        completed: this.saveManager.data.lights.courage,
        tokens: 100,
        stampKey: 'mega_mela'
      },
      4: {
        id: 'qst_community',
        lightName: '🍯 Community Flavours',
        title: 'Mela Sweets & Volunteers',
        objective: 'Collect festival jalebis from Rupa at the Food Lane and deliver to the Hub kiosk.',
        npcId: 'npc_rupa',
        hasSweets: false,
        completed: this.saveManager.data.lights.community,
        tokens: 100,
        stampKey: 'housing_pandal'
      },
      5: {
        id: 'qst_home',
        lightName: '🏮 Home Light',
        title: 'Memories of Dhanbad',
        objective: 'Speak with Dida near Heritage Lane to complete the oral chronicle and light the 5th Lantern.',
        npcId: 'npc_dida',
        completed: this.saveManager.data.lights.home,
        tokens: 250,
        stampKey: 'heritage_lane'
      }
    };

    this.currentChapter = this.saveManager.data.currentChapter;
    this.updateHUD();
  }

  getCurrentQuest() {
    return this.quests[this.currentChapter] || this.quests[5];
  }

  updateHUD() {
    const q = this.getCurrentQuest();
    if (this.hud) {
      if (this.isAllCompleted()) {
        this.hud.updateObjective(
          '🏆 Festival Champion',
          'All 5 Lights Restored!',
          'You have lit the Five Lights of Dhanbad! Explore freely, take photos, and celebrate.'
        );
      } else {
        this.hud.updateObjective(
          q.lightName,
          `Chapter ${this.currentChapter}/5`,
          q.objective
        );
      }
    }
  }

  isAllCompleted() {
    return Object.values(this.saveManager.data.lights).every(Boolean);
  }

  progressCraftCollect() {
    const q = this.quests[2];
    q.currentCount++;
    if (q.currentCount >= q.targetCount) {
      this.hud.showToast(`Found all 3 Lotuses! Return to Madan da.`);
      q.objective = 'All 3 Lotuses collected! Speak with Madan da to assemble the Craft Light.';
    } else {
      this.hud.showToast(`Collected Golden Lotus (${q.currentCount}/${q.targetCount})`);
      q.objective = `Find remaining Golden Lotuses (${q.currentCount}/${q.targetCount}) in Jharudih craft lane.`;
    }
    this.updateHUD();
  }

  completeCurrentChapter() {
    const q = this.getCurrentQuest();
    if (!q) return;

    q.completed = true;
    let lightKey = 'welcome';
    if (this.currentChapter === 1) lightKey = 'welcome';
    if (this.currentChapter === 2) lightKey = 'craft';
    if (this.currentChapter === 3) lightKey = 'courage';
    if (this.currentChapter === 4) lightKey = 'community';
    if (this.currentChapter === 5) lightKey = 'home';

    this.saveManager.completeLight(lightKey);
    this.saveManager.unlockStamp(q.stampKey);
    this.saveManager.addTokens(q.tokens);

    this.audioDirector.playFanfare();
    this.hud.showCelebration(q.lightName);

    if (this.currentChapter < 5) {
      this.currentChapter++;
      this.saveManager.data.currentChapter = this.currentChapter;
      this.saveManager.save();
    }

    this.updateHUD();
  }
}
