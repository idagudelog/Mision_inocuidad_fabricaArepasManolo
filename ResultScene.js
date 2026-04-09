// ============================================================
//  ResultScene.js – Pantalla de resultados + resumen educativo
// ============================================================

class ResultScene extends Phaser.Scene {
  constructor() { super('ResultScene'); }

  init(data) {
    this.score = data.score || 0;
    this.identified = data.identified || [];
    this.total = data.total || 12;
    this.timeUsed = data.timeUsed || 90;
  }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // Fondo
    this.add.image(W/2, H/2, 'bg');
    const ov = this.add.graphics();
    ov.fillStyle(0x000000, 0.82);
    ov.fillRect(0, 0, W, H);

    const pct = Math.round((this.identified.length / this.total) * 100);
    const passed = pct >= 60;

    // Título resultado
    this.add.text(W/2, 38, passed ? '🏆 INSPECCIÓN APROBADA' : '⚠️ INSPECCIÓN FALLIDA', {
      fontFamily: 'Bebas Neue, sans-serif', fontSize: '40px',
      color: passed ? '#2ecc71' : '#e74c3c',
      stroke: '#000', strokeThickness: 5
    }).setOrigin(0.5);

    // Métricas
    const metrics = [
      { label: 'PUNTUACIÓN',      value: this.score + ' pts',           col: '#f1c40f' },
      { label: 'PELIGROS ID.',    value: this.identified.length + '/' + this.total, col: '#3498db' },
      { label: '% EFECTIVIDAD',   value: pct + '%',                     col: passed ? '#2ecc71' : '#e74c3c' },
    ];
    metrics.forEach((m, i) => {
      const mx = 140 + i * 240;
      const bg = this.add.graphics();
      bg.fillStyle(0x0a1a0f, 0.9);
      bg.fillRoundedRect(mx - 100, 75, 200, 72, 10);
      bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(m.col).color, 0.7);
      bg.strokeRoundedRect(mx - 100, 75, 200, 72, 10);

      this.add.text(mx, 95, m.label, {
        fontFamily: 'Nunito, sans-serif', fontSize: '12px', color: '#95a5a6'
      }).setOrigin(0.5);
      this.add.text(mx, 118, m.value, {
        fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: m.col
      }).setOrigin(0.5);
    });

    // ---- RESUMEN EDUCATIVO POR CATEGORÍA ----
    this.add.text(W/2, 164, 'RESUMEN DE PELIGROS POR CATEGORÍA', {
      fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#ecf0f1'
    }).setOrigin(0.5);

    const catDefs = [
      { key: 'biologico', label: '🦠 Biológicos', col: '#27ae60', darkCol: 0x0a2a15 },
      { key: 'fisico',    label: '⚠️ Físicos',    col: '#e67e22', darkCol: 0x2a1500 },
      { key: 'quimico',   label: '⚗️ Químicos',   col: '#9b59b6', darkCol: 0x1a0a2a },
    ];

    // Scroll container via 3 columnas
    const colX = [140, 400, 660];
    const startY = 185;

    catDefs.forEach((cat, ci) => {
      const items = HAZARD_DATA[cat.key].items;
      const cx = colX[ci];
      const colW = 230;

      // Cabecera columna
      const headBg = this.add.graphics();
      headBg.fillStyle(Phaser.Display.Color.HexStringToColor(cat.col).color, 0.25);
      headBg.fillRoundedRect(cx - colW/2, startY, colW, 30, 6);
      headBg.lineStyle(1.5, Phaser.Display.Color.HexStringToColor(cat.col).color, 0.8);
      headBg.strokeRoundedRect(cx - colW/2, startY, colW, 30, 6);

      this.add.text(cx, startY + 15, cat.label, {
        fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontStyle: 'bold', color: cat.col
      }).setOrigin(0.5);

      // Items
      items.forEach((item, ii) => {
        const iy = startY + 36 + ii * 28;
        const wasId = this.identified.some(h => h.id === item.id);

        const rowBg = this.add.graphics();
        rowBg.fillStyle(wasId ? 0x0a3a18 : 0x1a0a08, 0.7);
        rowBg.fillRoundedRect(cx - colW/2, iy, colW, 24, 4);

        this.add.text(cx - colW/2 + 8, iy + 12, item.emoji + '  ' + item.name, {
          fontFamily: 'Nunito, sans-serif', fontSize: '12px',
          color: wasId ? '#2ecc71' : '#95a5a6'
        }).setOrigin(0, 0.5);

        if (wasId) {
          this.add.text(cx + colW/2 - 8, iy + 12, '✓', {
            fontFamily: 'Nunito, sans-serif', fontSize: '14px', color: '#2ecc71'
          }).setOrigin(1, 0.5);
        }
      });
    });

    // ---- MENSAJE EDUCATIVO ----
    const msgY = 460;
    const msg = passed
      ? '¡Excelente trabajo! Conocer los peligros es el primer paso del control basado en HACCP.'
      : 'Recuerda: identificar los 3 tipos de peligros es clave para garantizar la inocuidad alimentaria.';

    this.add.text(W/2, msgY, msg, {
      fontFamily: 'Nunito, sans-serif', fontSize: '13px', color: '#bdc3c7',
      align: 'center', wordWrap: { width: 700 }
    }).setOrigin(0.5);

    // ---- BOTONES ----
    this._makeBtn(W/2 - 140, 488, 'JUGAR DE NUEVO', '#27ae60', () => this.scene.start('GameScene'));
    this._makeBtn(W/2 + 140, 488, 'MENÚ PRINCIPAL', '#2980b9', () => this.scene.start('MenuScene'));
  }

  _makeBtn(x, y, label, col, cb) {
    const bw = 230, bh = 44;
    const hexCol = Phaser.Display.Color.HexStringToColor(col).color;
    const bg = this.add.graphics();
    bg.fillStyle(hexCol, 0.35);
    bg.fillRoundedRect(x - bw/2, y - bh/2, bw, bh, 10);
    bg.lineStyle(2, hexCol, 0.9);
    bg.strokeRoundedRect(x - bw/2, y - bh/2, bw, bh, 10);

    const txt = this.add.text(x, y, label, {
      fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#ffffff'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const zone = this.add.zone(x, y, bw, bh).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(hexCol, 0.75);
      bg.fillRoundedRect(x - bw/2, y - bh/2, bw, bh, 10);
      bg.lineStyle(2, 0xffffff, 0.8);
      bg.strokeRoundedRect(x - bw/2, y - bh/2, bw, bh, 10);
    });
    zone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(hexCol, 0.35);
      bg.fillRoundedRect(x - bw/2, y - bh/2, bw, bh, 10);
      bg.lineStyle(2, hexCol, 0.9);
      bg.strokeRoundedRect(x - bw/2, y - bh/2, bw, bh, 10);
    });
    zone.on('pointerdown', cb);
  }
}
