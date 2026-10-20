export class DialogueBox {
  constructor(questManager, audioDirector, rideSystem) {
    this.questManager = questManager;
    this.audioDirector = audioDirector;
    this.rideSystem = rideSystem;

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
    this.roleEl.innerText = npc.role;

    this.audioDirector.playInteractionChime();
    this.showNode('intro');
  }

  close() {
    this.isOpen = false;
    this.container.classList.add('hidden');
    this.currentNPC = null;
  }

  showNode(nodeKey) {
    const node = this.currentNPC.dialogueTree[nodeKey];
    if (!node) {
      this.close();
      return;
    }

    this.textEl.innerText = node.text;
    this.choicesEl.innerHTML = '';

    node.choices.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerText = c.label;
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
      // Craft quest active
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
