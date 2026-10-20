export class PhotoMode {
  constructor(engine, audioDirector, hud) {
    this.engine = engine;
    this.audioDirector = audioDirector;
    this.hud = hud;

    this.overlay = document.getElementById('photo-mode');
    this.btnSnap = document.getElementById('btn-snap-photo');
    this.btnExit = document.getElementById('btn-exit-photo');
    this.photoLocationTag = document.getElementById('photo-location-tag');
    this.photoTimestamp = document.getElementById('photo-timestamp');

    this.isActive = false;

    if (this.btnSnap) {
      this.btnSnap.addEventListener('click', () => this.capturePhoto());
    }

    if (this.btnExit) {
      this.btnExit.addEventListener('click', () => this.exit());
    }
  }

  toggle(currentDistrictName) {
    if (this.isActive) {
      this.exit();
    } else {
      this.enter(currentDistrictName);
    }
  }

  enter(districtName = 'Dhanbad Festival World') {
    this.isActive = true;
    this.overlay.classList.remove('hidden');

    if (this.photoLocationTag) {
      this.photoLocationTag.innerText = `${districtName} • Lights of the City`;
    }

    if (this.photoTimestamp) {
      const now = new Date();
      this.photoTimestamp.innerText = `20 Oct 2026 • ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;
    }

    this.audioDirector.playInteractionChime();
  }

  exit() {
    this.isActive = false;
    this.overlay.classList.add('hidden');
  }

  capturePhoto() {
    this.audioDirector.playCameraShutter();
    this.hud.triggerScreenFlash();

    // Render 1 frame cleanly through composer
    if (this.engine.composer) {
      this.engine.composer.render();
    } else {
      this.engine.renderer.render(this.engine.scene, this.engine.camera);
    }

    // Get 3D canvas
    const webglCanvas = this.engine.renderer.domElement;

    // Create composite postcard canvas with festive gold branding
    const postWidth = webglCanvas.width;
    const postHeight = webglCanvas.height;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = postWidth;
    exportCanvas.height = postHeight;
    const ctx = exportCanvas.getContext('2d');

    // Draw 3D screen
    ctx.drawImage(webglCanvas, 0, 0);

    // Draw festive decorative gold border
    ctx.strokeStyle = '#FFD54F';
    ctx.lineWidth = 14;
    ctx.strokeRect(10, 10, postWidth - 20, postHeight - 20);

    ctx.strokeStyle = '#FFA000';
    ctx.lineWidth = 4;
    ctx.strokeRect(26, 26, postWidth - 52, postHeight - 52);

    // Vignette
    const gradient = ctx.createRadialGradient(
      postWidth / 2, postHeight / 2, postWidth * 0.3,
      postWidth / 2, postHeight / 2, postWidth * 0.7
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, postWidth, postHeight);

    // Watermark Branding
    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 36px "Cinzel", "Yatra One", Georgia, serif';
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 12;
    ctx.fillText('DHANBAD DURGA PUJA 2026', 44, postHeight - 64);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(this.photoLocationTag ? this.photoLocationTag.innerText : 'Lights of the City', 44, postHeight - 34);

    // Download postcard
    const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.92);
    const link = document.createElement('a');
    link.download = `Dhanbad_Durga_Puja_Memory_${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();

    this.hud.showToast('Postcard photo captured & saved to downloads!');
  }
}
