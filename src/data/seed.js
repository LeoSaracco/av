// ─── SEED DATA ────────────────────────────────────────────────────────────────
// Datos mock reales y coherentes para demo comercial

export const SEED_CLIENTS = [
  {
    id: 'c1',
    name: 'Martina Gómez',
    email: 'martina@gmail.com',
    phone: '+54 11 4523-8891',
    goal: 'Perder 8 kg y tonificar piernas y glúteos',
    status: 'activo',
    joinDate: '2025-09-15',
    avatar: null,
  },
  {
    id: 'c2',
    name: 'Lucas Fernández',
    email: 'lucas.fit@gmail.com',
    phone: '+54 11 3312-0045',
    goal: 'Ganar masa muscular, alcanzar 80 kg de masa magra',
    status: 'activo',
    joinDate: '2025-10-01',
    avatar: null,
  },
  {
    id: 'c3',
    name: 'Sofía Herrera',
    email: 'sofia.h@outlook.com',
    phone: '+54 11 6781-2234',
    goal: 'Mejorar rendimiento en running, bajar 10k a 48 min',
    status: 'activo',
    joinDate: '2025-11-10',
    avatar: null,
  },
  {
    id: 'c4',
    name: 'Diego Ramírez',
    email: 'diego.ram@gmail.com',
    phone: '+54 11 5590-3312',
    goal: 'Rehabilitación de espalda baja y ganar movilidad',
    status: 'pausado',
    joinDate: '2025-08-20',
    avatar: null,
  },
];

export const SEED_TEMPLATES = [
  {
    id: 't1',
    name: 'Full Body Hipertrofia 3x',
    goal: 'Ganar masa muscular general',
    description: 'Rutina de 3 días por semana de cuerpo completo enfocada en volumen e hipertrofia.',
    exercises: [
      { id: 'e1', name: 'Sentadilla libre', sets: 4, reps: 10, rest: '90s', notes: 'Profundidad paralela, rodillas hacia afuera', videoUrl: '' },
      { id: 'e2', name: 'Press de banca plano', sets: 4, reps: 10, rest: '90s', notes: 'Retracción escapular, grip a lo ancho de hombros', videoUrl: '' },
      { id: 'e3', name: 'Remo con barra', sets: 4, reps: 10, rest: '90s', notes: 'Torso a 45°, codos pegados al cuerpo', videoUrl: '' },
      { id: 'e4', name: 'Press militar', sets: 3, reps: 12, rest: '75s', notes: 'Core activo, sin arquear la espalda', videoUrl: '' },
      { id: 'e5', name: 'Curl de bíceps barra', sets: 3, reps: 12, rest: '60s', notes: 'Movimiento controlado, sin balanceo', videoUrl: '' },
      { id: 'e6', name: 'Tríceps en polea alta', sets: 3, reps: 12, rest: '60s', notes: 'Mantener codos fijos durante el movimiento', videoUrl: '' },
    ],
    createdAt: '2025-09-01',
  },
  {
    id: 't2',
    name: 'Cardio + Fuerza Funcional',
    goal: 'Quemar grasa y mejorar condición física general',
    description: 'Circuito de alta intensidad combinando cardio y ejercicios funcionales. Ideal para pérdida de grasa.',
    exercises: [
      { id: 'e7', name: 'Burpees', sets: 4, reps: 15, rest: '45s', notes: 'Mantener ritmo constante', videoUrl: '' },
      { id: 'e8', name: 'Kettlebell swing', sets: 4, reps: 20, rest: '60s', notes: 'Potencia desde caderas, no desde brazos', videoUrl: '' },
      { id: 'e9', name: 'Box jump', sets: 3, reps: 12, rest: '60s', notes: 'Aterrizaje suave, rodillas flexionadas', videoUrl: '' },
      { id: 'e10', name: 'Plancha con remo', sets: 3, reps: 10, rest: '60s', notes: 'Caderas estables, alternar brazos', videoUrl: '' },
      { id: 'e11', name: 'Sentadilla + salto', sets: 3, reps: 15, rest: '45s', notes: 'Explosivo en la subida', videoUrl: '' },
      { id: 'e12', name: 'Mountain climbers', sets: 4, reps: 30, rest: '30s', notes: '30 repeticiones totales, máxima velocidad', videoUrl: '' },
    ],
    createdAt: '2025-09-05',
  },
  {
    id: 't3',
    name: 'Definición Avanzada',
    goal: 'Definición muscular y reducción de grasa corporal',
    description: 'Superseries y circuitos de alta densidad para maximizar el gasto calórico y mantener músculo.',
    exercises: [
      { id: 'e13', name: 'Sentadilla frontal', sets: 4, reps: 8, rest: '90s', notes: 'Peso moderado-alto, técnica perfecta', videoUrl: '' },
      { id: 'e14', name: 'Peso muerto rumano', sets: 4, reps: 10, rest: '90s', notes: 'Énfasis en isquiotibiales, espalda recta', videoUrl: '' },
      { id: 'e15', name: 'Dominadas lastradas', sets: 3, reps: 8, rest: '120s', notes: 'Rango completo de movimiento', videoUrl: '' },
      { id: 'e16', name: 'Fondos en paralelas', sets: 3, reps: 12, rest: '75s', notes: 'Inclinación leve hacia adelante para pecho', videoUrl: '' },
      { id: 'e17', name: 'Hip thrust con barra', sets: 4, reps: 12, rest: '75s', notes: 'Apoyar hombros en banco, extensión completa', videoUrl: '' },
    ],
    createdAt: '2025-09-10',
  },
];

export const SEED_ROUTINES = [
  {
    id: 'r1',
    name: 'Full Body Hipertrofia – Martina',
    goal: 'Ganar tono muscular y fuerza general',
    templateId: 't1',
    exercises: JSON.parse(JSON.stringify(SEED_TEMPLATES[0].exercises)),
    createdAt: '2025-09-20',
  },
  {
    id: 'r2',
    name: 'Hipertrofia Intensa – Lucas',
    goal: 'Máxima ganancia de masa muscular',
    templateId: 't1',
    exercises: [
      { id: 'e1b', name: 'Sentadilla libre', sets: 5, reps: 8, rest: '120s', notes: 'Peso máximo con técnica correcta', videoUrl: '' },
      { id: 'e2b', name: 'Press de banca inclinado con mancuernas', sets: 4, reps: 10, rest: '90s', notes: 'Mayor rango de movimiento', videoUrl: '' },
      { id: 'e3b', name: 'Dominadas con lastre', sets: 4, reps: 8, rest: '120s', notes: '10 kg de lastre', videoUrl: '' },
      { id: 'e4b', name: 'Press Arnold', sets: 4, reps: 10, rest: '90s', notes: 'Rotación completa en cada rep', videoUrl: '' },
      { id: 'e5b', name: 'Curl martillo alterno', sets: 4, reps: 12, rest: '60s', notes: 'Énfasis en braquiorradial', videoUrl: '' },
      { id: 'e6b', name: 'Extensión de tríceps francés', sets: 3, reps: 12, rest: '60s', notes: 'Cabeza larga del tríceps', videoUrl: '' },
    ],
    createdAt: '2025-10-05',
  },
  {
    id: 'r3',
    name: 'Running + Funcional – Sofía',
    goal: 'Mejorar capacidad aeróbica y fuerza funcional para running',
    templateId: 't2',
    exercises: [
      { id: 'e7b', name: 'Interval running (treadmill)', sets: 1, reps: 10, rest: '30s', notes: '10 intervalos: 1 min rápido / 30s recuperación', videoUrl: '' },
      { id: 'e8b', name: 'Step-up con mancuernas', sets: 3, reps: 15, rest: '60s', notes: 'Banco altura rodilla, alternando piernas', videoUrl: '' },
      { id: 'e9b', name: 'Zancadas caminando', sets: 3, reps: 20, rest: '60s', notes: '10 cada pierna, con mancuernas livianas', videoUrl: '' },
      { id: 'e10b', name: 'Plancha lateral', sets: 3, reps: 30, rest: '45s', notes: '30 segundos cada lado', videoUrl: '' },
      { id: 'e11b', name: 'Hip bridge con banda', sets: 3, reps: 20, rest: '45s', notes: 'Banda sobre rodillas para activar glúteos', videoUrl: '' },
    ],
    createdAt: '2025-11-15',
  },
];

export const SEED_ASSIGNMENTS = [
  { id: 'a1', clientId: 'c1', routineId: 'r1', assignedAt: '2025-09-20', active: true },
  { id: 'a2', clientId: 'c2', routineId: 'r2', assignedAt: '2025-10-05', active: true },
  { id: 'a3', clientId: 'c3', routineId: 'r3', assignedAt: '2025-11-15', active: true },
];

export const SEED_NOTES = [
  {
    id: 'n1',
    clientId: 'c1',
    text: 'Martina está progresando muy bien. Subió 5 kg en sentadilla esta semana. Revisar técnica de press al pasar de 30 kg.',
    createdAt: '2025-11-10',
    updatedAt: '2025-11-10',
  },
  {
    id: 'n2',
    clientId: 'c1',
    text: 'Tuvo una semana difícil por trabajo. Recomendé bajar la intensidad un 20% esta semana y priorizar el descanso.',
    createdAt: '2025-11-24',
    updatedAt: '2025-11-24',
  },
  {
    id: 'n3',
    clientId: 'c2',
    text: 'Lucas alcanzó el objetivo de 78 kg. Ajustar calorías a 3400 kcal y continuar con progresión en press. Próxima revisión en 2 semanas.',
    createdAt: '2025-11-05',
    updatedAt: '2025-11-05',
  },
  {
    id: 'n4',
    clientId: 'c2',
    text: 'Excelente adherencia al plan. Aumentar volumen de espalda la próxima fase. Agregar 1 día de especialización.',
    createdAt: '2025-11-19',
    updatedAt: '2025-11-19',
  },
  {
    id: 'n5',
    clientId: 'c3',
    text: 'Sofía corrió 10k en 51 minutos. Buen progreso. Aumentar frecuencia de intervalos a 3 veces por semana.',
    createdAt: '2025-11-20',
    updatedAt: '2025-11-20',
  },
];

export const SEED_PROGRESS = [
  // Martina
  { id: 'p1', clientId: 'c1', date: '2025-09-15', weight: 67.5, comment: 'Inicio del programa.' },
  { id: 'p2', clientId: 'c1', date: '2025-09-29', weight: 67.0, comment: 'Bajé un poco. Bien con la dieta.' },
  { id: 'p3', clientId: 'c1', date: '2025-10-13', weight: 66.2, comment: 'Muy buena semana, mucha energía.' },
  { id: 'p4', clientId: 'c1', date: '2025-10-27', weight: 65.8, comment: 'Costó más esta semana por viajes.' },
  { id: 'p5', clientId: 'c1', date: '2025-11-10', weight: 65.1, comment: 'Se nota la diferencia en espejo.' },
  { id: 'p6', clientId: 'c1', date: '2025-11-24', weight: 64.5, comment: 'Bajé al gimnasio 4 veces, récord personal.' },
  // Lucas
  { id: 'p7', clientId: 'c2', date: '2025-10-01', weight: 72.0, comment: 'Inicio. Objetivo: 80 kg.' },
  { id: 'p8', clientId: 'c2', date: '2025-10-15', weight: 73.2, comment: 'Subi peso, comiendo más.' },
  { id: 'p9', clientId: 'c2', date: '2025-10-29', weight: 74.5, comment: 'Excelente. Más fuerza en todos los ejercicios.' },
  { id: 'p10', clientId: 'c2', date: '2025-11-12', weight: 75.8, comment: 'Casi 4 kg en 6 semanas.' },
  { id: 'p11', clientId: 'c2', date: '2025-11-26', weight: 77.1, comment: 'Récord en sentadilla: 110 kg.' },
  // Sofía
  { id: 'p12', clientId: 'c3', date: '2025-11-10', weight: 58.0, comment: 'Inicio. Me siento bien.' },
  { id: 'p13', clientId: 'c3', date: '2025-11-24', weight: 57.3, comment: '10k en 51 min. Bajando!' },
];

export const SEED_PRODUCTS = [
  {
    id: 'prod1',
    category: 'Ropa',
    name: 'Remera Entrenamiento AV',
    description: 'Remera premium de entrenamiento con tela técnica dry-fit. Transpirable y cómoda para cualquier actividad física.',
    price: 8500,
    image: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Blanco', 'Verde'],
    stock: 20,
  },
  {
    id: 'prod2',
    category: 'Ropa',
    name: 'Calza Compresión Pro',
    description: 'Calza de compresión de alta performance. Soporte muscular superior para entrenamiento intenso y recuperación.',
    price: 12900,
    image: null,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Verde/Negro'],
    stock: 15,
  },
  {
    id: 'prod3',
    category: 'Ropa',
    name: 'Camiseta Sin Manga Performance',
    description: 'Musculosa de entrenamiento ultra liviana. Diseño ergonómico para máximo rango de movimiento.',
    price: 6900,
    image: null,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Gris'],
    stock: 25,
  },
  {
    id: 'prod4',
    category: 'Suplementos',
    name: 'Proteína Whey Premium 2 kg',
    description: 'Whey protein de alta calidad, 24g de proteína por porción. Sabor chocolate premium. Ideal para recuperación muscular.',
    price: 32000,
    image: null,
    flavors: ['Chocolate', 'Vainilla', 'Frutilla'],
    stock: 10,
  },
  {
    id: 'prod5',
    category: 'Suplementos',
    name: 'Creatina Monohidrato 500g',
    description: 'Creatina monohidrato micronizada de pureza farmacéutica. Aumenta fuerza, potencia y recuperación.',
    price: 18500,
    image: null,
    flavors: ['Sin sabor'],
    stock: 12,
  },
  {
    id: 'prod6',
    category: 'Suplementos',
    name: 'Pre-entreno AV Formula',
    description: 'Pre-workout con cafeína, beta-alanina y citrulina. Máxima energía y foco para tus entrenos.',
    price: 22000,
    image: null,
    flavors: ['Sandía', 'Limón', 'Frutos Rojos'],
    stock: 8,
  },
  {
    id: 'prod7',
    category: 'Accesorios',
    name: 'Shaker AV Edición Especial',
    description: 'Vaso mezclador de 750ml con bola mezcladora. Libre de BPA. Diseño AV exclusivo.',
    price: 4500,
    image: null,
    colors: ['Negro/Verde', 'Negro/Blanco'],
    stock: 30,
  },
  {
    id: 'prod8',
    category: 'Accesorios',
    name: 'Mat de Yoga / Stretching',
    description: 'Colchoneta antideslizante de 8mm de espesor. Ideal para yoga, pilates y stretching post-entrenamiento.',
    price: 9800,
    image: null,
    colors: ['Negro', 'Verde Oscuro'],
    stock: 18,
  },
];

// ── MOCK USERS ─────────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 'coach1', role: 'coach', name: 'Adrián Vila', email: 'adrian@av.com', password: 'coach123' },
  { id: 'c1', role: 'client', name: 'Martina Gómez', email: 'martina@gmail.com', password: '1234', clientId: 'c1' },
  { id: 'c2', role: 'client', name: 'Lucas Fernández', email: 'lucas.fit@gmail.com', password: '1234', clientId: 'c2' },
  { id: 'c3', role: 'client', name: 'Sofía Herrera', email: 'sofia.h@outlook.com', password: '1234', clientId: 'c3' },
];
