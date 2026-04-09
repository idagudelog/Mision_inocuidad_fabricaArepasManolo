// ============================================================
//  BootScene.js – Genera texturas proceduralmente
// ============================================================

class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  create() {
    this._generateTextures();
    this.scene.start('MenuScene');
  }

  _generateTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // --- FONDO DE ESTABLECIMIENTO ---
    g.clear();
    g.fillStyle(0x1c3a2a);
    g.fillRect(0, 0, 800, 500);
    g.lineStyle(1, 0x0d2518, 0.7);
    for (let x = 0; x < 800; x += 50) { g.moveTo(x,0); g.lineTo(x,500); }
    for (let y = 0; y < 500; y += 50) { g.moveTo(0,y); g.lineTo(800,y); }
    g.strokePath();
    g.fillStyle(0x8B4513);
    g.fillRect(0, 310, 800, 20);
    g.fillStyle(0xa0522d);
    g.fillRect(0, 290, 800, 22);
    g.fillStyle(0x5c2e00);
    g.fillRect(0, 330, 800, 80);
    g.fillStyle(0x7ec8e3, 0.35);
    g.fillRect(0, 330, 800, 80);
    g.fillStyle(0x2a1a10);
    g.fillRect(0, 0, 800, 80);
    g.fillStyle(0x4a2800);
    g.fillRect(20, 95, 180, 12);
    g.fillRect(230, 95, 180, 12);
    g.fillRect(440, 95, 180, 12);
    g.fillRect(650, 95, 130, 12);
    g.generateTexture('bg', 800, 500);

    // --- JUGADOR (inspector) ---
    g.clear();
    g.fillStyle(0xffffff);
    g.fillRect(6, 0, 20, 8);
    g.fillStyle(0xdddddd);
    g.fillRect(4, 7, 24, 4);
    g.fillStyle(0xf4a460);
    g.fillRect(8, 10, 16, 16);
    g.fillStyle(0xe8f4f8);
    g.fillRect(5, 26, 22, 22);
    g.fillRect(0, 26, 6, 18);
    g.fillRect(27, 26, 6, 18);
    g.fillStyle(0xc8dce8);
    g.fillRect(6, 48, 8, 14);
    g.fillRect(18, 48, 8, 14);
    g.fillStyle(0x333333);
    g.fillRect(5, 60, 10, 4);
    g.fillRect(17, 60, 10, 4);
    g.fillStyle(0xf5deb3);
    g.fillRect(27, 28, 7, 10);
    g.fillStyle(0x333333);
    g.fillRect(11, 14, 3, 3);
    g.fillRect(18, 14, 3, 3);
    g.generateTexture('player', 32, 64);

    // --- PELIGROS (iconos por tipo) ---
    const hazardDefs = {
      biologico: 0x27ae60,
      fisico:    0xe67e22,
      quimico:   0x9b59b6
    };

    Object.entries(hazardDefs).forEach(([type, col]) => {
      g.clear();
      g.fillStyle(col);
      g.fillRoundedRect(1, 1, 42, 42, 8);
      g.lineStyle(2, 0xffffff, 0.5);
      g.strokeRoundedRect(1, 1, 42, 42, 8);
      g.fillStyle(0xffffff, 0.9);
      if (type === 'biologico') {
        g.fillCircle(22, 22, 8);
        g.fillStyle(col, 0.8);
        g.fillCircle(22, 22, 4);
        g.fillStyle(0xffffff, 0.9);
        for (let a = 0; a < 6; a++) {
          const ang = (a / 6) * Math.PI * 2;
          g.fillCircle(22 + Math.cos(ang)*13, 22 + Math.sin(ang)*13, 3);
        }
      } else if (type === 'fisico') {
        g.fillTriangle(22, 8, 36, 34, 8, 34);
        g.fillStyle(col);
        g.fillTriangle(22, 13, 33, 31, 11, 31);
        g.fillStyle(0xffffff);
        g.fillRect(21, 18, 2, 8);
        g.fillRect(21, 28, 2, 2);
      } else {
        g.fillRect(17, 10, 10, 4);
        g.fillStyle(col);
        g.fillRect(18, 12, 8, 2);
        g.fillStyle(0xffffff, 0.9);
        g.fillRoundedRect(13, 14, 18, 20, 4);
        g.fillStyle(col, 0.6);
        g.fillRoundedRect(15, 20, 14, 12, 3);
      }
      g.generateTexture('hazard_' + type, 44, 44);
    });

    // --- PANEL OSCURO ---
    g.clear();
    g.fillStyle(0x000000, 0.8);
    g.fillRoundedRect(0, 0, 500, 300, 14);
    g.lineStyle(2, 0xffffff, 0.25);
    g.strokeRoundedRect(0, 0, 500, 300, 14);
    g.generateTexture('panel', 500, 300);

    // --- CARNE (decoración) ---
    g.clear();
    g.fillStyle(0xc0392b);
    g.fillEllipse(30, 15, 60, 28);
    g.fillStyle(0xe74c3c);
    g.fillEllipse(28, 13, 48, 20);
    g.fillStyle(0xfad7a0, 0.5);
    g.fillEllipse(20, 12, 16, 9);
    g.generateTexture('meat', 60, 30);

    // --- PARTÍCULAS ---
    g.clear();
    g.fillStyle(0xffffff);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particle', 8, 8);

    g.destroy();
  }
}
