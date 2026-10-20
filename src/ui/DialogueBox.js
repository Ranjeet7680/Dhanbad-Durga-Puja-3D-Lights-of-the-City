import { Localization } from '../core/Localization.js';

export class DialogueBox {
  constructor(questManager, audioDirector, rideSystem, hindiVoice) {
    this.questManager = questManager;
    this.audioDirector = audioDirector;
    this.rideSystem = rideSystem;
    this.hindiVoice = hindiVoice;

    this.container = document.getElementById('dialogue-box');
    this.avatarEl = document.getElementById('dialogue-avatar');
    this.nameEl = document.getElementById('dialogue-name');
    this.roleEl = document.getElementById('dialogue-role');
    this.textEl = document.getElementById('dialogue-text');
    this.choicesEl = document.getElementById('dialogue-choices');
    this.btnClose = document.getElementById('btn-close-dialogue');

    this.isOpen = false;
    this.currentNPC = null;

    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }
  }

  open(npc) {
    this.currentNPC = npc;
    this.isOpen = true;
    this.container.classList.remove('hidden');

    this.avatarEl.innerText = npc.emoji || '👤';
    this.nameEl.innerText = npc.name;
    this.roleEl.innerText = Localization.currentLang === 'hi' && npc.roleHi ? npc.roleHi : npc.role;

    this.audioDirector.playInteractionChime();
    this.showNode('intro');
  }

  close() {
    this.isOpen = false;
    this.container.classList.add('hidden');
    this.currentNPC = null;
    if (this.hindiVoice) {
      this.hindiVoice.stop();
    }
  }

  showNode(nodeKey) {
    const node = this.currentNPC.dialogueTree[nodeKey];
    if (!node) {
      this.close();
      return;
    }

    const isHi = Localization.currentLang === 'hi';
    const displayText = isHi && node.textHi ? node.textHi : node.text;
    const spokenHindi = node.textHi || node.text;

    this.textEl.innerText = displayText;
    this.choicesEl.innerHTML = '';

    // Speak Hindi dialogue narration!
    if (this.hindiVoice) {
      this.hindiVoice.speakNPC(this.currentNPC.id, spokenHindi);
    }

    node.choices.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerText = (isHi && c.label) ? c.label : (c.labelEn || c.label);
      btn.addEventListener('click', () => {
        this.audioDirector.playInteractionChime();
        if (c.action) {
          this.executeAction(c.action);
        }
        if (c.next) {
          this.showNode(c.next);
        } else {
          this.close();
        }
      });
      this.choicesEl.appendChild(btn);
    });
  }

  executeAction(action) {
    if (action === 'accept_welcome_quest') {
      if (this.questManager.currentChapter === 1) {
        this.questManager.completeCurrentChapter();
      }
    } else if (action === 'start_craft_quest') {
      this.questManager.updateHUD();
    } else if (action === 'start_ferris_ride') {
      this.close();
      this.rideSystem.startRide();
    } else if (action === 'start_food_quest') {
      if (this.questManager.currentChapter === 4) {
        this.questManager.completeCurrentChapter();
      }
    } else if (action === 'complete_home_quest') {
      if (this.questManager.currentChapter === 5) {
        this.questManager.completeCurrentChapter();
      }
    }
  }
}
