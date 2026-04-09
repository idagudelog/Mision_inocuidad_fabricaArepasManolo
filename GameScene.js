// ============================================================
//  GameScene.js – Lógica principal del juego
// ============================================================

class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init() {
    this.score = 0;
    this.timeLeft = 90;
    this.identified = [];
    this.questionActive = false;
    this.currentHazard = null;
    this.hazardObjects = [];
    this.playerSpeed = 180;
    this.lives = 3;
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.W = W; this.H = H;

    // ---- ESCENA ----
    this.add.image(W/2, H/2, 'bg').setDepth(0);

    // Carnes decorativas en mostrador
    [-1,1].forEach(s => {
      for (let x = 80; x < W - 40; x += 120 + Math.abs(s)*20) {
        this.add.image(x + s*15, 305, 'meat').setDepth(1).setAlpha(0.85);
      }
    });

    // Título de zona
    this.add.text(W/2, 42, '⚗ ZONA DE INSPECCIÓN SANITARIA ⚗', {
      fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px',
      color: '#f8c8a0', stroke: '#3d1500', strokeThickness: 3
    }).setOrigin(0.5).setDepth(5);

    // ---- JUGADOR ----
    this.player = this.physics.add.sprite(W/2, 230, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    this.player.setScale(1.5);
    // Zona de colisión más pequeña
    this.player.body.setSize(20, 30);
    this.player.body.setOffset(6, 30);

    // ---- TECLAS ----
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // ---- PELIGROS ----
    this._spawnHazards();

    // ---- HUD ----
    this._createHUD();

    // ---- TIMER ----
    this.timerEvent = this.time.addEvent({
      delay: 1000, callback: this._tick, callbackScope: this, repeat: this.timeLeft - 1
    });

    // ---- DETECCIÓN DE PROXIMIDAD ----
    this.time.addEvent({ delay: 200, callback: this._checkProximity, callbackScope: this, loop: true });
  }

  // ============================================================
  //  SPAWN DE PELIGROS
  // ============================================================
  _spawnHazards() {
    // Mezclar y seleccionar 12 peligros variados
    const pool = Phaser.Utils.Array.Shuffle([...ALL_HAZARDS]).slice(0, 12);
    const positions = this._generatePositions(12);

    pool.forEach((hazard, i) => {
      const pos = positions[i];
      const sprite = this.physics.add.sprite(pos.x, pos.y, 'hazard_' + hazard.type);
      sprite.setDepth(8);
      sprite.hazardData = hazard;
      sprite.identified = false;

      // Animación flotante
      this.tweens.add({
        targets: sprite, y: pos.y - 8, duration: 1000 + Math.random() * 600,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        delay: Math.random() * 500
      });

      // Etiqueta del nombre (pequeña)
      const label = this.add.text(pos.x, pos.y + 32, hazard.emoji, {
        fontSize: '20px'
      }).setOrigin(0.5).setDepth(9);
      sprite.label = label;

      this.hazardObjects.push({ sprite, label, hazard, pos });
    });
  }

  _generatePositions(count) {
    const zones = [];
    const W = this.W, H = this.H;
    const rows = [130, 185, 240]; // filas de juego (arriba del mostrador)
    const cols = [80, 180, 290, 400, 510, 620, 720];

    rows.forEach(y => cols.forEach(x => {
      if (x > 40 && x < W - 40 && y > 105 && y < 280) zones.push({ x, y });
    }));

    return Phaser.Utils.Array.Shuffle(zones).slice(0, count);
  }

  // ============================================================
  //  HUD
  // ============================================================
  _createHUD() {
    const W = this.W;

    // Barra inferior oscura
    const hudBg = this.add.graphics();
    hudBg.fillStyle(0x000000, 0.75);
    hudBg.fillRect(0, 420, W, 80);
    hudBg.setDepth(20);

    // Score
    this.scoreTxt = this.add.text(20, 435, '⭐ 0 pts', {
      fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#f1c40f'
    }).setDepth(21);

    // Timer
    this.timerTxt = this.add.text(W/2, 435, '⏱ 90s', {
      fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#2ecc71'
    }).setOrigin(0.5, 0).setDepth(21);

    // Vidas
    this.livesTxt = this.add.text(W - 20, 435, '❤️ ❤️ ❤️', {
      fontFamily: 'Nunito, sans-serif', fontSize: '22px'
    }).setOrigin(1, 0).setDepth(21);

    // Progreso (peligros identificados)
    this.progressTxt = this.add.text(W/2, 462, '0 / 12 peligros identificados', {
      fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#95a5a6'
    }).setOrigin(0.5, 0).setDepth(21);

    // Hint abajo
    this.hintTxt = this.add.text(W/2, 484, '↑↓←→ mover  |  WASD también funciona', {
      fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#4a6a5a'
    }).setOrigin(0.5, 0).setDepth(21);
  }

  _tick() {
    this.timeLeft--;
    const col = this.timeLeft < 20 ? '#e74c3c' : this.timeLeft < 40 ? '#f39c12' : '#2ecc71';
    this.timerTxt.setText('⏱ ' + this.timeLeft + 's').setColor(col);

    if (this.timeLeft <= 0) {
      this.timerEvent.remove();
      this._endGame();
    }
  }

  // ============================================================
  //  DETECCIÓN DE PROXIMIDAD
  // ============================================================
  _checkProximity() {
    if (this.questionActive) return;

    const px = this.player.x, py = this.player.y;
    const RADIUS = 60;

    for (const obj of this.hazardObjects) {
      if (obj.sprite.identified) continue;
      const dist = Phaser.Math.Distance.Between(px, py, obj.sprite.x, obj.sprite.y);
      if (dist < RADIUS) {
        this._showQuestion(obj);
        return;
      }
    }
  }

  // ============================================================
  //  PREGUNTA FLOTANTE
  // ============================================================
  _showQuestion(obj) {
    this.questionActive = true;
    this.currentHazard = obj;
    const W = this.W, H = this.H;

    // Congelar jugador
    this.player.setVelocity(0, 0);

    // Overlay
    this.overlay = this.add.graphics().setDepth(30);
    this.overlay.fillStyle(0x000000, 0.65);
    this.overlay.fillRect(0, 0, W, H);

    // Panel central
    const panW = 540, panH = 310;
    const panX = W/2 - panW/2, panY = H/2 - panH/2 - 20;

    this.qPanel = this.add.graphics().setDepth(31);
    this.qPanel.fillStyle(0x0d1f15, 0.97);
    this.qPanel.fillRoundedRect(panX, panY, panW, panH, 14);
    this.qPanel.lineStyle(2, 0x27ae60, 0.7);
    this.qPanel.strokeRoundedRect(panX, panY, panW, panH, 14);

    const h = obj.hazard;

    // Emoji grande
    this.qEmoji = this.add.text(W/2, panY + 38, h.emoji, {
      fontSize: '42px'
    }).setOrigin(0.5).setDepth(32);

    // Nombre del peligro
    this.qTitle = this.add.text(W/2, panY + 82, h.name, {
      fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', color: '#f8f9fa'
    }).setOrigin(0.5).setDepth(32);

    // Pregunta
    this.qQuestion = this.add.text(W/2, panY + 115, '¿A qué categoría pertenece este peligro?', {
      fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#bdc3c7', align: 'center'
    }).setOrigin(0.5).setDepth(32);

    // Botones de respuesta
    const btnData = [
      { label: '🦠  Biológico', type: 'biologico', col: 0x27ae60, x: W/2 - 160 },
      { label: '⚠️  Físico',    type: 'fisico',    col: 0xe67e22, x: W/2 },
      { label: '⚗️  Químico',   type: 'quimico',   col: 0x9b59b6, x: W/2 + 160 },
    ];

    this.qButtons = [];
    this.qBtnGraphics = [];

    btnData.forEach(bd => {
      const bw = 140, bh = 48, bx = bd.x - bw/2, by = panY + 150;
      const bg = this.add.graphics().setDepth(32);
      bg.fillStyle(bd.col, 0.3);
      bg.fillRoundedRect(bx, by, bw, bh, 10);
      bg.lineStyle(2, bd.col, 0.9);
      bg.strokeRoundedRect(bx, by, bw, bh, 10);

      const txt = this.add.text(bd.x, by + bh/2, bd.label, {
        fontFamily: 'Nunito, sans-serif', fontSize: '15px', fontStyle: 'bold',
        color: '#ffffff', align: 'center'
      }).setOrigin(0.5).setDepth(33).setInteractive({ useHandCursor: true });

      const zone = this.add.zone(bd.x, by + bh/2, bw, bh)
        .setDepth(34).setInteractive({ useHandCursor: true });

      zone.on('pointerover', () => {
        bg.clear();
        bg.fillStyle(bd.col, 0.7);
        bg.fillRoundedRect(bx, by, bw, bh, 10);
        bg.lineStyle(2, 0xffffff, 0.9);
        bg.strokeRoundedRect(bx, by, bw, bh, 10);
        this.tweens.add({ targets: txt, scaleX:1.06, scaleY:1.06, duration:80 });
      });
      zone.on('pointerout', () => {
        bg.clear();
        bg.fillStyle(bd.col, 0.3);
        bg.fillRoundedRect(bx, by, bw, bh, 10);
        bg.lineStyle(2, bd.col, 0.9);
        bg.strokeRoundedRect(bx, by, bw, bh, 10);
        this.tweens.add({ targets: txt, scaleX:1, scaleY:1, duration:80 });
      });
      zone.on('pointerdown', () => this._answer(bd.type, obj));

      this.qButtons.push({ bg, txt, zone, bd });
      this.qBtnGraphics.push(bg, txt, zone);
    });

    // Descripción (oculta inicialmente)
    this.qDesc = this.add.text(W/2, panY + 225, '', {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#ecf0f1',
      align: 'center', wordWrap: { width: 490 }
    }).setOrigin(0.5).setDepth(32).setAlpha(0);

    // Feedback
    this.qFeedback = this.add.text(W/2, panY + 270, '', {
      fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', align: 'center'
    }).setOrigin(0.5).setDepth(32);

    this.qObjects = [this.overlay, this.qPanel, this.qEmoji, this.qTitle,
      this.qQuestion, this.qDesc, this.qFeedback, ...this.qBtnGraphics];
  }

  // ============================================================
  //  RESPUESTA DEL JUGADOR
  // ============================================================
  _answer(selectedType, obj) {
    const correct = selectedType === obj.hazard.type;

    // Deshabilitar botones
    this.qButtons.forEach(b => b.zone.disableInteractive());

    if (correct) {
      this.score += 100;
      this.scoreTxt.setText('⭐ ' + this.score + ' pts');
      this.qFeedback.setText('✅ ¡CORRECTO! +100 pts').setColor('#2ecc71');
      obj.sprite.identified = true;
      this.identified.push(obj.hazard);

      // Cambiar sprite a "identificado"
      obj.sprite.setAlpha(0.4);
      obj.sprite.setTint(0x00ff88);
      obj.label.setText('✓');

      // Partículas de éxito
      this._emitParticles(obj.sprite.x, obj.sprite.y, 0x2ecc71);

      // Actualizar progreso
      this.progressTxt.setText(this.identified.length + ' / 12 peligros identificados');

      if (this.identified.length >= 12) {
        this.time.delayedCall(1200, () => this._endGame());
        return;
      }
    } else {
      this.timeLeft = Math.max(0, this.timeLeft - 10);
      this.timerTxt.setText('⏱ ' + this.timeLeft + 's').setColor('#e74c3c');
      this.qFeedback.setText('❌ ERROR — ' + this._catName(obj.hazard.type) + ' — ¡-10s!').setColor('#e74c3c');
      this.lives--;
      this.livesTxt.setText(Array(this.lives).fill('❤️').join(' ') || '💔');
      this._flashRed();
    }

    // Mostrar descripción educativa
    this.qDesc.setText(obj.hazard.desc).setAlpha(1);
    this.tweens.add({ targets: this.qDesc, alpha: 1, duration: 300 });

    // Cerrar panel tras delay
    this.time.delayedCall(correct ? 2000 : 2800, () => this._closeQuestion());
  }

  _catName(type) {
    return type === 'biologico' ? 'Biológico' : type === 'fisico' ? 'Físico' : 'Químico';
  }

  _closeQuestion() {
    if (this.qObjects) {
      this.qObjects.forEach(o => { if (o && o.destroy) o.destroy(); });
      this.qObjects = [];
    }
    this.questionActive = false;
    this.currentHazard = null;
  }

  _emitParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const p = this.add.graphics().setDepth(15);
      p.fillStyle(color);
      p.fillCircle(0, 0, 4);
      p.x = x; p.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 80;
      this.tweens.add({
        targets: p, x: x + Math.cos(angle)*speed, y: y + Math.sin(angle)*speed,
        alpha: 0, scaleX: 0, scaleY: 0, duration: 700 + Math.random()*300,
        onComplete: () => p.destroy()
      });
    }
  }

  _flashRed() {
    const flash = this.add.graphics().setDepth(50);
    flash.fillStyle(0xff0000, 0.3);
    flash.fillRect(0, 0, this.W, this.H);
    this.tweens.add({ targets: flash, alpha: 0, duration: 400, onComplete: () => flash.destroy() });
  }

  // ============================================================
  //  UPDATE
  // ============================================================
  update() {
    if (this.questionActive) {
      this.player.setVelocity(0, 0);
      return;
    }

    const spd = this.playerSpeed;
    const c = this.cursors, w = this.wasd;
    let vx = 0, vy = 0;

    if (c.left.isDown  || w.left.isDown)  vx = -spd;
    if (c.right.isDown || w.right.isDown) vx = +spd;
    if (c.up.isDown    || w.up.isDown)    vy = -spd;
    if (c.down.isDown  || w.down.isDown)  vy = +spd;

    // Limitar a zona de juego (no entrar al mostrador ni la pared)
    if (this.player.y > 285 && vy > 0) vy = 0;
    if (this.player.y < 108 && vy < 0) vy = 0;

    this.player.setVelocity(vx, vy);

    // Flip horizontal
    if (vx < 0) this.player.setFlipX(true);
    if (vx > 0) this.player.setFlipX(false);
  }

  // ============================================================
  //  FIN DE JUEGO
  // ============================================================
  _endGame() {
    this.timerEvent && this.timerEvent.remove();
    this._closeQuestion();
    this.time.delayedCall(300, () => {
      this.scene.start('ResultScene', {
        score: this.score,
        identified: this.identified,
        total: this.hazardObjects.length,
        timeUsed: 90 - this.timeLeft
      });
    });
  }
}
