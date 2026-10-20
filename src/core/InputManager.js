import * as THREE from 'three';

export class InputManager {
  constructor() {
    this.keys = {};
    this.justPressed = {};

    // Camera orbit angles
    this.cameraPitch = 0.25; // Radians
    this.cameraYaw = 0;     // Radians
    this.isMouseDown = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    // Movement vector normalized
    this.moveVector = new THREE.Vector2(0, 0);
    this.isSprinting = false;
    this.jumpRequested = false;

    // Mobile Joystick
    this.joystickActive = false;
    this.joystickOrigin = { x: 0, y: 0 };

    this.initKeyboard();
    this.initMouse();
    this.initTouch();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      const code = e.code;
      if (!this.keys[code]) {
        this.justPressed[code] = true;
      }
      this.keys[code] = true;

      // Handle Shift sprint
      if (e.shiftKey) {
        this.isSprinting = true;
      }

      // Space jump
      if (code === 'Space') {
        this.jumpRequested = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;
      this.keys[code] = false;
      if (!e.shiftKey) {
        this.isSprinting = false;
      }
    });
  }

  initMouse() {
    window.addEventListener('mousedown', (e) => {
      // Don't capture mouse if clicked on UI elements
      if (e.target.closest('#hud, .modal-backdrop, .dialogue-overlay, .photo-mode-overlay, .intro-screen, .ride-overlay')) {
        return;
      }
      this.isMouseDown = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown) return;

      const deltaX = e.clientX - this.lastMouseX;
      const deltaY = e.clientY - this.lastMouseY;

      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      const sensitivity = 0.005;
      this.cameraYaw -= deltaX * sensitivity;
      this.cameraPitch = Math.max(-0.2, Math.min(1.2, this.cameraPitch + deltaY * sensitivity));
    });

    // Zoom on wheel
    window.addEventListener('wheel', (e) => {
      // Handled in player camera offset if needed
    }, { passive: true });
  }

  initTouch() {
    const joystickBase = document.getElementById('joystick-base');
    const joystickThumb = document.getElementById('joystick-thumb');

    if (joystickBase && joystickThumb) {
      const onTouchStart = (e) => {
        const touch = e.touches[0];
        const rect = joystickBase.getBoundingClientRect();
        this.joystickActive = true;
        this.joystickOrigin = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      };

      const onTouchMove = (e) => {
        if (!this.joystickActive) return;
        const touch = e.touches[0];
        const dx = touch.clientX - this.joystickOrigin.x;
        const dy = touch.clientY - this.joystickOrigin.y;
        const maxDist = 45;
        const dist = Math.hypot(dx, dy);
        const clampedDist = Math.min(dist, maxDist);
        const angle = Math.atan2(dy, dx);

        const thumbX = Math.cos(angle) * clampedDist;
        const thumbY = Math.sin(angle) * clampedDist;

        joystickThumb.style.transform = `translate(calc(-50% + ${thumbX}px), calc(-50% + ${thumbY}px))`;

        this.moveVector.x = thumbX / maxDist;
        this.moveVector.y = -thumbY / maxDist;
      };

      const onTouchEnd = () => {
        this.joystickActive = false;
        joystickThumb.style.transform = 'translate(-50%, -50%)';
        this.moveVector.set(0, 0);
      };

      joystickBase.addEventListener('touchstart', onTouchStart, { passive: false });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd, { passive: false });
    }

    // Touch Action buttons
    const btnInteract = document.getElementById('btn-touch-interact');
    if (btnInteract) {
      btnInteract.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.justPressed['KeyE'] = true;
      });
    }

    const btnJump = document.getElementById('btn-touch-jump');
    if (btnJump) {
      btnJump.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.jumpRequested = true;
      });
    }
  }

  isKeyPressed(code) {
    return !!this.keys[code];
  }

  wasKeyJustPressed(code) {
    const val = !!this.justPressed[code];
    this.justPressed[code] = false;
    return val;
  }

  updateMovement() {
    let forward = 0;
    let right = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) forward += 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) forward -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) right += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) right -= 1;

    if (forward !== 0 || right !== 0) {
      const len = Math.hypot(forward, right);
      this.moveVector.set(right / len, forward / len);
    } else if (!this.joystickActive) {
      this.moveVector.set(0, 0);
    }
  }

  clearJustPressed() {
    this.justPressed = {};
    this.jumpRequested = false;
  }
}
