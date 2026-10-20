export class HUD {
  constructor(saveManager) {
    this.saveManager = saveManager;

    // Elements
    this.districtNameEl = document.getElementById('district-name');
    this.objectiveDescEl = document.getElementById('objective-desc');
    this.objectiveLightTagEl = document.getElementById('objective-light-tag');
    this.objectiveCounterEl = document.getElementById('objective-counter');

    this.interactionPromptEl = document.getElementById('interaction-prompt');
    this.interactionLabelEl = document.getElementById('interaction-label');
    this.interactionKeyEl = document.getElementById('interaction-key');

    this.hudTokensEl = document.getElementById('hud-tokens');
    this.hudLightsEl = document.getElementById('hud-lights');
    this.hudStampBadgeEl = document.getElementById('hud-stamp-badge');

    this.clockTimeEl = document.getElementById('clock-time-display');
    this.clockBandEl = document.getElementById('clock-band-display');

    this.toastEl = document.getElementById('toast');
    this.toastMsgEl = document.getElementById('toast-message');

    this.minimapCanvas = document.getElementById('minimap-canvas');
    if (this.minimapCanvas) {
      this.minimapCtx = this.minimapCanvas.getContext('2d');
    }

    this.updateStats();
  }

  updateStats() {
    if (this.hudTokensEl) {
      this.hudTokensEl.innerText = this.saveManager.data.tokens;
    }
    if (this.hudLightsEl) {
      const lit = Object.values(this.saveManager.data.lights).filter(Boolean).length;
      this.hudLightsEl.innerText = `${lit}/5`;
    }
    if (this.hudStampBadgeEl) {
      const stamps = Object.values(this.saveManager.data.stamps).filter(Boolean).length;
      this.hudStampBadgeEl.innerText = `${stamps}/5`;
    }
  }

  updateDistrict(name) {
    if (this.districtNameEl && this.districtNameEl.innerText !== name) {
      this.districtNameEl.innerText = name;
    }
  }

  updateObjective(lightTag, counter, desc) {
    if (this.objectiveLightTagEl) this.objectiveLightTagEl.innerText = lightTag;
    if (this.objectiveCounterEl) this.objectiveCounterEl.innerText = counter;
    if (this.objectiveDescEl) this.objectiveDescEl.innerText = desc;
    this.updateStats();
  }

  showInteractionPrompt(label, key = 'E') {
    if (this.interactionPromptEl) {
      this.interactionPromptEl.classList.add('active');
      this.interactionLabelEl.innerText = label;
      this.interactionKeyEl.innerText = key;
    }
  }

  hideInteractionPrompt() {
    if (this.interactionPromptEl) {
      this.interactionPromptEl.classList.remove('active');
    }
  }

  showToast(message) {
    if (!this.toastEl) return;
    this.toastMsgEl.innerText = message;
    this.toastEl.classList.remove('hidden');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl.classList.add('hidden');
    }, 3500);
  }

  showCelebration(lightName) {
    this.showToast(`✨ Light Restored: ${lightName}! Token bonus granted!`);
    this.triggerScreenFlash();
    this.triggerConfetti();
  }

  triggerScreenFlash() {
    const flash = document.getElementById('camera-flash');
    if (flash) {
      flash.classList.add('flash-active');
      setTimeout(() => flash.classList.remove('flash-active'), 150);
    }
  }

  triggerConfetti() {
    // Pure canvas celebratory particles
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '990';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#FFD54F', '#FF1744', '#00E5FF', '#76FF03', '#FF6D00', '#E040FB'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 16,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.2
      });
    }

    let elapsed = 0;
    const anim = () => {
      elapsed++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      if (elapsed < 80) {
        requestAnimationFrame(anim);
      } else {
        canvas.remove();
      }
    };
    requestAnimationFrame(anim);
  }

  renderMinimap(playerPos, playerYaw, landmarks) {
    if (!this.minimapCtx) return;
    const ctx = this.minimapCtx;
    const w = this.minimapCanvas.width;
    const h = this.minimapCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 1.0; // 1 world unit = 1 pixel

    ctx.clearRect(0, 0, w, h);

    // Dark radar circle
    ctx.fillStyle = '#0F1626';
    ctx.beginPath();
    ctx.arc(cx, cy, cx - 2, 0, Math.PI * 2);
    ctx.fill();

    // Concentric range rings
    ctx.strokeStyle = 'rgba(255, 179, 0, 0.2)';
    ctx.lineWidth = 1;
    [25, 50, 75].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw Landmarks relative to player
    landmarks.forEach((lm) => {
      const rx = (lm.position.x - playerPos.x) * scale;
      const rz = (lm.position.z - playerPos.z) * scale;

      // Check if within radar circle
      if (Math.hypot(rx, rz) < cx - 6) {
        ctx.fillStyle = lm.color || '#FFB300';
        ctx.beginPath();
        ctx.arc(cx + rx, cy + rz, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(lm.name, cx + rx, cy + rz - 6);
      }
    });

    // Player arrow in center
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-playerYaw);

    ctx.fillStyle = '#00E5FF';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(4, 5);
    ctx.lineTo(0, 3);
    ctx.lineTo(-4, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
