// ============================================================
//  DATA.JS  – Peligros en la elaboración de masa para arepas boyacenses
//  Materias primas: Queso, Harina de trigo, Sal, Colorante
//  Producto: Masa cruda empacada individualmente lista para asar
// ============================================================

const HAZARD_DATA = {
  biologico: {
    label: 'Biológico',
    color: 0x27ae60,
    darkColor: 0x1a7a42,
    textColor: '#d5f5e3',
    icon: '🦠',
    items: [
      { id: 'staph',       name: 'Staphylococcus aureus',     emoji: '🦠', desc: 'Bacteria presente en manos, nariz y garganta del personal. El queso mal refrigerado favorece su crecimiento. Produce toxinas resistentes al calor.' },
      { id: 'listeria',    name: 'Listeria monocytogenes',    emoji: '🧫', desc: 'Patógeno asociado a quesos frescos. Crece a temperaturas de refrigeración. Peligroso para embarazadas e inmunodeprimidos.' },
      { id: 'aspergillus', name: 'Aspergillus flavus',        emoji: '🍄', desc: 'Moho que coloniza harina de trigo con humedad excesiva o almacenamiento inadecuado. Produce aflatoxinas cancerígenas resistentes al calor.' },
      { id: 'bacillus',    name: 'Bacillus cereus',           emoji: '🔬', desc: 'Bacteria esporulada muy común en harinas y cereales. Sus esporas sobreviven el procesamiento y germinan en la masa cruda produciendo toxinas.' },
      { id: 'salmonella',  name: 'Salmonella spp.',           emoji: '🧪', desc: 'Puede contaminar la masa por contaminación cruzada desde superficies sucias, personal portador o agua de proceso no potable.' },
      { id: 'ecoli',       name: 'Escherichia coli',          emoji: '💧', desc: 'Indica contaminación fecal por malas prácticas de higiene del personal. Riesgo elevado al manipular queso y masa con manos sin higienizar.' },
      { id: 'mucor',       name: 'Mucor / Rhizopus spp.',     emoji: '🌿', desc: 'Mohos de crecimiento rápido en queso húmedo o masa con exceso de agua. Alteran la calidad sensorial y pueden producir micotoxinas.' },
    ]
  },
  fisico: {
    label: 'Físico',
    color: 0xe67e22,
    darkColor: 0xb35a00,
    textColor: '#fdebd0',
    icon: '⚠️',
    items: [
      { id: 'piedra',   name: 'Fragmento de piedra / arena', emoji: '🪨', desc: 'Proviene de la sal sin refinar o harina de trigo mal tamizada. Puede causar fractura dental. Control: tamizado y especificaciones al proveedor.' },
      { id: 'metal',    name: 'Fragmento metálico',          emoji: '🔩', desc: 'Originado por desgaste de paletas mezcladoras, ralladores o equipos de porcionado. Detectables con detector de metales en línea.' },
      { id: 'plastico', name: 'Fragmento de plástico',       emoji: '🛍️', desc: 'Restos de empaques de materias primas que caen al abrir costales o bolsas. Puede pasar desapercibido por color similar a la masa.' },
      { id: 'cabello',  name: 'Cabello / uña de operario',   emoji: '💇', desc: 'Contaminación por ausencia de cofia, tapabocas o guantes. Control: BPM estrictas y supervisión del uso correcto de elementos de protección.' },
      { id: 'insecto',  name: 'Insecto (gorgojos / ácaros)', emoji: '🐛', desc: 'Plagas comunes en almacenes de harina y sal. Indican fallas en el programa de control de plagas y las condiciones de almacenamiento.' },
      { id: 'bolsa',    name: 'Fragmento de bolsa de empaque',emoji: '📦', desc: 'Pedazos de material de empaque individual que contaminan la masa durante el porcionado automático o manual. Revisar selladoras.' },
      { id: 'hilo',     name: 'Hilo / fibra de costal',      emoji: '🧵', desc: 'Fibras de costales de harina, sal o queso que caen durante el vaciado. Riesgo de atragantamiento. Usar costales sin fibras sueltas.' },
    ]
  },
  quimico: {
    label: 'Químico',
    color: 0x8e44ad,
    darkColor: 0x6c3483,
    textColor: '#e8daef',
    icon: '⚗️',
    items: [
      { id: 'aflatoxina',   name: 'Aflatoxinas (micotoxinas)',   emoji: '☣️', desc: 'Toxinas producidas por mohos en harina almacenada inadecuadamente. Son cancerígenas y termoestables: no se eliminan con cocción ni asado.' },
      { id: 'desinfectante',name: 'Residuo de desinfectante',    emoji: '🧴', desc: 'Limpieza inadecuada de mezcladora, mesas y utensilios. El cloro residual o amonio cuaternario altera la masa y puede ser nocivo para la salud.' },
      { id: 'migracion',    name: 'Migración desde empaque',     emoji: '📋', desc: 'Plastificantes (ftalatos, BPA) o tintas de impresión del empaque individual migran hacia la masa cruda durante almacenamiento prolongado.' },
      { id: 'maquillaje',   name: 'Maquillaje y cosméticos',     emoji: '💄', desc: 'El uso de maquillaje, perfumes o cremas por operarios contamina la masa con compuestos químicos ajenos al producto. Las BPM prohíben su uso en planta de producción.' },
    ]
  }
};

// Flatten para uso en el juego
const ALL_HAZARDS = [];
Object.entries(HAZARD_DATA).forEach(([type, cat]) => {
  cat.items.forEach(item => {
    ALL_HAZARDS.push({ ...item, type, category: cat.label, color: cat.color, darkColor: cat.darkColor });
  });
});

// Colores de categoría para UI
const CAT_COLORS = {
  biologico: { bg: '#1a4a2a', border: '#27ae60', text: '#2ecc71' },
  fisico:    { bg: '#4a2a05', border: '#e67e22', text: '#f39c12' },
  quimico:   { bg: '#2a0a4a', border: '#8e44ad', text: '#9b59b6' }
};
