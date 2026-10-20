import * as THREE from 'three';

export class TextureGenerator {
  // Traditional Alpona (Floor art)
  static createAlponaTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Deep terracotta / red oxide festival floor
    ctx.fillStyle = '#8B2500';
    ctx.fillRect(0, 0, size, size);

    // Subtle stone texture
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    for (let i = 0; i < 2000; i++) {
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }

    // White floral rice paste pattern (Alpona)
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 4;

    const cx = size / 2;
    const cy = size / 2;

    // Concentric circles
    [40, 80, 130, 180, 230].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 8-Petal Lotus in center
    const petals = 8;
    for (let i = 0; i < petals; i++) {
      const angle = (i * Math.PI * 2) / petals;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(25, -60, 0, -80);
      ctx.quadraticCurveTo(-25, -60, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    // Outer Paisley / Conch borders
    const outerCount = 16;
    for (let i = 0; i < outerCount; i++) {
      const angle = (i * Math.PI * 2) / outerCount;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.arc(0, -180, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, -210, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Rich Festive Brocade Fabric (for Pandal Interior & Ceiling)
  static createBrocadeFabricTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Royal Crimson Red Base
    ctx.fillStyle = '#A31526';
    ctx.fillRect(0, 0, size, size);

    // Gold zari lattice lines
    ctx.strokeStyle = '#FFD54F';
    ctx.lineWidth = 3;

    const step = 64;
    for (let x = 0; x <= size; x += step) {
      for (let y = 0; y <= size; y += step) {
        // Gold motif
        ctx.fillStyle = '#FFC107';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 213, 79, 0.4)';
        ctx.strokeRect(x - 20, y - 20, 40, 40);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }

  // Paved festival stone road
  static createRoadTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Dark grey asphalt/stone
    ctx.fillStyle = '#222630';
    ctx.fillRect(0, 0, size, size);

    // Stone paver lines
    ctx.strokeStyle = '#161922';
    ctx.lineWidth = 2;
    const pSize = 32;
    for (let y = 0; y < size; y += pSize) {
      const offset = (y / pSize) % 2 === 0 ? 0 : pSize / 2;
      for (let x = -pSize; x < size + pSize; x += pSize) {
        ctx.strokeRect(x + offset, y, pSize, pSize);
      }
    }

    // Yellow festival curb stripes along edges
    ctx.fillStyle = '#FFA000';
    ctx.fillRect(0, 0, 16, size);
    ctx.fillRect(size - 16, 0, 16, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 40);
    return texture;
  }

  // Marigold Garlands (Gendaphool)
  static createMarigoldTexture() {
    const w = 256;
    const h = 64;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, w, h);

    const flowers = 8;
    const step = w / flowers;
    for (let i = 0; i < flowers; i++) {
      const cx = i * step + step / 2;
      const cy = h / 2;
      const isOrange = i % 2 === 0;

      ctx.fillStyle = isOrange ? '#FF6F00' : '#FFD54F';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      // Flower petals texture
      ctx.fillStyle = isOrange ? '#E65100' : '#FFA000';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Signboard / Banner
  static createSignboardTexture(title, subtitle, colorScheme = 'gold') {
    const width = 1024;
    const height = 256;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (colorScheme === 'gold') {
      grad.addColorStop(0, '#7A141A');
      grad.addColorStop(0.5, '#4A0D10');
      grad.addColorStop(1, '#7A141A');
    } else {
      grad.addColorStop(0, '#0D1B2A');
      grad.addColorStop(0.5, '#1B263B');
      grad.addColorStop(1, '#0D1B2A');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Ornate gold border
    ctx.strokeStyle = '#FFD54F';
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = '#FFA000';
    ctx.lineWidth = 3;
    ctx.strokeRect(22, 22, width - 44, height - 44);

    // Main text
    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 54px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText(title, width / 2, height / 2 - 24);

    // Subtitle
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(subtitle, width / 2, height / 2 + 38);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}
