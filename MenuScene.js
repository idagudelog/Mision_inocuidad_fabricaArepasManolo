// ============================================================
//  MenuScene.js – Pantalla de inicio
// ============================================================

class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // Fondo
    this.add.image(W/2, H/2, 'bg');

    // Overlay oscuro
    const ov = this.add.graphics();
    ov.fillStyle(0x000000, 0.6);
    ov.fillRect(0, 0, W, H);

    // Título principal
    this.add.text(W/2, 90, 'INSPECTOR SANITARIO', {
      fontFamily: 'Bebas Neue, Impact, sans-serif',
      fontSize: '52px',
      color: '#e74c3c',
      stroke: '#7b241c',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(W/2, 148, 'Establecimiento de Carne Fresca de Cerdo', {
      fontFamily: 'Nunito, sans-serif',
      fontSize: '18px',
      color: '#f8c8a0',
      fontStyle: 'italic'
    }).setOrigin(0.5);

    // Panel de instrucciones
    const panelW = 560, panelH = 220;
    const px = W/2 - panelW/2, py = 180;
    const panel = this.add.graphics();
    panel.fillStyle(0x0a1a0f, 0.9);
    panel.fillRoundedRect(px, py, panelW, panelH, 12);
    panel.lineStyle(2, 0x27ae60, 0.6);
    panel.strokeRoundedRect(px, py, panelW, panelH, 12);

    this.add.text(W/2, py + 22, '¿CÓMO JUGAR?', {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '22px',
      color: '#2ecc71'
    }).setOrigin(0.5);

    const instructions = [
      '🔍  Mueve el inspector con las flechas del teclado o WASD',
      '⚠️  Al acercarte a un peligro, aparecerá una pregunta',
      '🧫  Clasifica el peligro: Biológico, Físico o Químico',
      '✅  Cada acierto suma puntos. Los errores restan tiempo',
      '🏆  Identifica todos los peligros antes de que se acabe el tiempo',
    ];

    instructions.forEach((line, i) => {
      this.add.text(px + 20, py + 50 + i * 30, line, {
        fontFamily: 'Nunito, sans-serif',
        fontSize: '15px',
        color: '#ecf0f1'
      });
    });

    // Categorías legend
    const catY = 420;
    const cats = [
      { label: 'Biológico', col: '#27ae60', x: W/2 - 220 },
      { label: 'Físico',    col: '#e67e22', x: W/2 },
      { label: 'Químico',   col: '#9b59b6', x: W/2 + 220 },
    ];
    cats.forEach(c => {
      const bg = this.add.graphics();
      bg.fillStyle(Phaser.Display.Color.HexStringToColor(c.col).color, 0.25);
      bg.lineStyle(2, Phaser.Display.Color.HexStringToColor(c.col).color, 0.8);
      bg.fillRoundedRect(c.x - 80, catY - 18, 160, 36, 8);
      bg.strokeRoundedRect(c.x - 80, catY - 18, 160, 36, 8);
      this.add.text(c.x, catY, c.label, {
        fontFamily: 'Nunito, sans-serif',
        fontSize: '17px',
        fontStyle: 'bold',
        color: c.col
      }).setOrigin(0.5);
    });

    // Botón JUGAR
    const btnY = 460;
    const btn = this.add.graphics();
    btn.fillStyle(0xc0392b);
    btn.fillRoundedRect(W/2 - 120, btnY - 25, 240, 50, 12);
    btn.lineStyle(2, 0xff6b6b, 0.8);
    btn.strokeRoundedRect(W/2 - 120, btnY - 25, 240, 50, 12);

    const btnText = this.add.text(W/2, btnY, '¡ INICIAR INSPECCIÓN !', {
      fontFamily: 'Bebas Neue, sans-serif',
      fontSize: '26px',
      color: '#ffffff'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const hitZone = this.add.zone(W/2, btnY, 240, 50).setInteractive({ useHandCursor: true });

    hitZone.on('pointerover', () => {
      btn.clear();
      btn.fillStyle(0xe74c3c);
      btn.fillRoundedRect(W/2 - 120, btnY - 25, 240, 50, 12);
      btn.lineStyle(2, 0xffffff, 0.9);
      btn.strokeRoundedRect(W/2 - 120, btnY - 25, 240, 50, 12);
      this.tweens.add({ targets: btnText, scaleX: 1.05, scaleY: 1.05, duration: 100 });
    });
    hitZone.on('pointerout', () => {
      btn.clear();
      btn.fillStyle(0xc0392b);
      btn.fillRoundedRect(W/2 - 120, btnY - 25, 240, 50, 12);
      btn.lineStyle(2, 0xff6b6b, 0.8);
      btn.strokeRoundedRect(W/2 - 120, btnY - 25, 240, 50, 12);
      this.tweens.add({ targets: btnText, scaleX: 1, scaleY: 1, duration: 100 });
    });
    hitZone.on('pointerdown', () => this.scene.start('GameScene'));

    // Versión
    this.add.text(W - 10, H - 10, 'v1.0 – Educación en Inocuidad Alimentaria', {
      fontFamily: 'Nunito, sans-serif', fontSize: '11px', color: '#4a7a5a'
    }).setOrigin(1, 1);

    // Animación parpadeante en botón
    this.tweens.add({
      targets: btnText, alpha: 0.7, duration: 800,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
  }
}
