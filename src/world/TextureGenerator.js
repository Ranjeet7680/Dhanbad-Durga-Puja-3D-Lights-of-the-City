import * as THREE from 'three';

export class TextureGenerator {
  // High-Detail Traditional Bengali Alpona (Floor art)
  static createAlponaTexture() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Rich Terracotta Red Oxide Festival Floor
    ctx.fillStyle = '#6E1C0A';
    ctx.fillRect(0, 0, size, size);

    // Stone texture grain
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    for (let i = 0; i < 6000; i++) {
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }

    // Sacred White Rice-Paste Artwork (Alpona)
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowBlur = 6;

    const cx = size / 2;
    const cy = size / 2;

    // Outer intricate decorative rings
    [60, 110, 180, 260, 340, 420, 480].forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.lineWidth = idx % 2 === 0 ? 5 : 2;
      ctx.stroke();
    });

    // Central 12-Petal Sacred Lotus
    const petals = 12;
    for (let i = 0; i < petals; i++) {
      const angle = (i * Math.PI * 2) / petals;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Lotus petal curve
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(35, -90, 0, -140);
      ctx.quadraticCurveTo(-35, -90, 0, 0);
      ctx.fill();

      // Inner vein line
      ctx.strokeStyle = '#6E1C0A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -110);
      ctx.stroke();

      ctx.restore();
    }

    // Outer Conch (Shankha) & Paisley Border Motifs
    const conchCount = 24;
    for (let i = 0; i < conchCount; i++) {
      const angle = (i * Math.PI * 2) / conchCount;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, -380, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, -440, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 8;
    return texture;
  }

  // Realistic Wet Asphalt Festival Road with Street Pavers & Curb Stripes
  static createRoadTexture() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Dark charcoal asphalt
    ctx.fillStyle = '#181C26';
    ctx.fillRect(0, 0, size, size);

    // Fine tarmac grain
    for (let i = 0; i < 15000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
    }

    // Wet puddle reflective patches (gloss variation)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    for (let p = 0; p < 8; p++) {
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * size, Math.random() * size,
        60 + Math.random() * 80, 40 + Math.random() * 50,
        Math.random() * Math.PI, 0, Math.PI * 2
      );
      ctx.fill();
    }

    // Interlocking street paver lines
    ctx.strokeStyle = '#0F121A';
    ctx.lineWidth = 3;
    const pSize = 64;
    for (let y = 0; y < size; y += pSize) {
      const offset = (y / pSize) % 2 === 0 ? 0 : pSize / 2;
      for (let x = -pSize; x < size + pSize; x += pSize) {
        ctx.strokeRect(x + offset, y, pSize, pSize);
      }
    }

    // Curb edge stripes (Yellow & Black caution border)
    const curbW = 32;
    for (let y = 0; y < size; y += 40) {
      const isYellow = (y / 40) % 2 === 0;
      ctx.fillStyle = isYellow ? '#FFB300' : '#111319';
      ctx.fillRect(0, y, curbW, 40);
      ctx.fillRect(size - curbW, y, curbW, 40);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 24);
    texture.anisotropy = 8;
    return texture;
  }

  // Realistic Royal Brocade Fabric for Pandal Ceilings & Walls
  static createBrocadeFabricTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Royal Crimson Red Silk
    ctx.fillStyle = '#8B0A1A';
    ctx.fillRect(0, 0, size, size);

    // Gold zari lattice diamond pattern
    ctx.strokeStyle = '#FFD54F';
    ctx.lineWidth = 3;

    const step = 64;
    for (let x = 0; x <= size; x += step) {
      for (let y = 0; y <= size; y += step) {
        // Gold Paisley & Flower medallion
        ctx.fillStyle = '#FFA000';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFF176';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Diamond lattice
        ctx.strokeStyle = 'rgba(255, 213, 79, 0.45)';
        ctx.strokeRect(x - 22, y - 22, 44, 44);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    return texture;
  }

  // Marigold Garlands (Gendaphool) with layered petals
  static createMarigoldTexture() {
    const w = 512;
    const h = 128;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, w, h);

    const flowers = 10;
    const step = w / flowers;
    for (let i = 0; i < flowers; i++) {
      const cx = i * step + step / 2;
      const cy = h / 2;
      const isOrange = i % 2 === 0;

      // Outer petals
      ctx.fillStyle = isOrange ? '#E65100' : '#FFA000';
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fill();

      // Middle petals
      ctx.fillStyle = isOrange ? '#FB8C00' : '#FFD54F';
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();

      // Center core
      ctx.fillStyle = isOrange ? '#FFB300' : '#FFF9C4';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // Realistic Ornate Signboard Texture
  static createSignboardTexture(title, subtitle, colorScheme = 'gold') {
    const width = 1024;
    const height = 256;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Deep gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (colorScheme === 'gold') {
      grad.addColorStop(0, '#6A0C14');
      grad.addColorStop(0.5, '#38060B');
      grad.addColorStop(1, '#6A0C14');
    } else {
      grad.addColorStop(0, '#0A182E');
      grad.addColorStop(0.5, '#122544');
      grad.addColorStop(1, '#0A182E');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Dual Gold Border
    ctx.strokeStyle = '#FFD54F';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.strokeStyle = '#FFA000';
    ctx.lineWidth = 3;
    ctx.strokeRect(22, 22, width - 44, height - 44);

    // Title
    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 50px "Cinzel", "Yatra One", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 14;
    ctx.fillText(title, width / 2, height / 2 - 24);

    // Subtitle
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(subtitle, width / 2, height / 2 + 36);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // Realistic Indian Commercial Shopfront (Sweets, Sarees, Electronics, Food)
  static createShopfrontTexture(shopHi, shopEn, type = 'sweets') {
    const width = 1024;
    const height = 512;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Wall & Glass shopframe interior gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#15101A');
    bgGrad.addColorStop(0.3, '#2A1C1A');
    bgGrad.addColorStop(1, '#1A1412');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Warm Interior Store Light glow
    const intGlow = ctx.createRadialGradient(width / 2, height * 0.45, 50, width / 2, height * 0.45, 450);
    intGlow.addColorStop(0, 'rgba(255, 213, 79, 0.45)');
    intGlow.addColorStop(0.7, 'rgba(230, 81, 0, 0.2)');
    intGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = intGlow;
    ctx.fillRect(0, 0, width, height);

    // Roll-up shutter box at top
    ctx.fillStyle = '#37474F';
    ctx.fillRect(0, 0, width, 55);
    ctx.fillStyle = '#263238';
    for (let y = 10; y < 55; y += 8) {
      ctx.fillRect(0, y, width, 3);
    }

    // Glass window border & mullions
    ctx.strokeStyle = '#546E7A';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 55, width - 10, height - 60);

    // Center divider mullion
    ctx.fillStyle = '#455A64';
    ctx.fillRect(width / 2 - 6, 55, 12, height - 55);

    // Store Display Specifics
    if (type === 'sweets') {
      // Tiered sweet display shelves with trays of laddu, gulab jamun, barfi
      for (let s = 0; s < 3; s++) {
        const shelfY = 220 + s * 90;
        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(40, shelfY, width - 80, 16);

        // Trays
        const trayCount = 6;
        const trayW = (width - 120) / trayCount;
        for (let t = 0; t < trayCount; t++) {
          const tx = 50 + t * trayW;
          ctx.fillStyle = '#B0BEC5'; // Steel tray
          ctx.fillRect(tx, shelfY - 26, trayW - 12, 26);

          // Sweets color
          const sweetCol = ['#FFA000', '#D84315', '#FFF9C4', '#8D6E63', '#FFB300', '#F4511E'][t % 6];
          ctx.fillStyle = sweetCol;
          for (let dot = 6; dot < trayW - 16; dot += 12) {
            ctx.beginPath();
            ctx.arc(tx + dot, shelfY - 14, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    } else {
      // Clothing / Electronics / Fabric shelves
      for (let s = 0; s < 3; s++) {
        const shelfY = 210 + s * 95;
        ctx.fillStyle = '#607D8B';
        ctx.fillRect(40, shelfY, width - 80, 14);

        const boltCount = 10;
        const boltW = (width - 120) / boltCount;
        for (let b = 0; b < boltCount; b++) {
          const bx = 50 + b * boltW;
          const fabricCol = ['#C2185B', '#E64A19', '#FBC02D', '#00897B', '#1E88E5', '#8E24AA'][b % 6];
          ctx.fillStyle = fabricCol;
          ctx.fillRect(bx, shelfY - 55, boltW - 8, 55);
        }
      }
    }

    // Glass sheen / reflection diagonal
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(100, height);
    ctx.lineTo(260, height);
    ctx.lineTo(width * 0.7, 55);
    ctx.lineTo(width * 0.55, 55);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Small lower gold text for authentic look
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${shopHi} • ${shopEn}`, width / 2, height - 20);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 4;
    return texture;
  }

  // Realistic Puja Committee Fabric Arch Banner
  static createPujaBannerTexture(committeeNameHi, taglineEn, bgColor = '#8B1E1E') {
    const width = 1024;
    const height = 256;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Rich Festive Background with cloth weave gradient
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, bgColor);
    grad.addColorStop(0.5, '#4A0D0D');
    grad.addColorStop(1, bgColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Marigold Border Top and Bottom
    for (let x = 12; x < width; x += 24) {
      ctx.fillStyle = '#FFA000';
      ctx.beginPath();
      ctx.arc(x, 14, 10, 0, Math.PI * 2);
      ctx.arc(x, height - 14, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFD54F';
      ctx.beginPath();
      ctx.arc(x, 14, 5, 0, Math.PI * 2);
      ctx.arc(x, height - 14, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border lines
    ctx.strokeStyle = '#FFD54F';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 28, width - 16, height - 56);

    // Sacred Om / Swastik / Trishul iconography
    ctx.fillStyle = '#FFD54F';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('卐', 60, height / 2 + 10);
    ctx.fillText('卐', width - 60, height / 2 + 10);

    // Main Committee Title (Hindi)
    ctx.fillStyle = '#FFF8E1';
    ctx.font = 'bold 46px "Cinzel", "Rozha One", serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 12;
    ctx.fillText(committeeNameHi, width / 2, height / 2 - 18);

    // Subtitle (English / Devanagari)
    ctx.fillStyle = '#FFD54F';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(taglineEn, width / 2, height / 2 + 38);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }
}
