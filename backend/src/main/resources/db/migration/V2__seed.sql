-- ── V2 — Datos semilla ───────────────────────────────────────────────────────
-- Coincide con seed.js del frontend para desarrollo local
-- Contraseñas: "coach123" y "1234" (BCrypt placeholder)

-- ── Coach ─────────────────────────────────────────────────────────────────────
INSERT INTO coaches (id, name, email, password_hash, roles) VALUES
('coach-1', 'Coach Alex', 'coach@avfitness.test',
 '$2a$10$rOzN0VFq0XVhM1Dx5vQ7bOcFq1MK7s0s0N5o0L6xR4Hl6Xm1xHkMG',
 'ROLE_COACH')
ON CONFLICT (id) DO NOTHING;

-- ── Clientes (4) ──────────────────────────────────────────────────────────────
INSERT INTO clients (id, name, email, password_hash, phone, goal, status, join_date, avatar, roles) VALUES
('client-1', 'María Gómez', 'maria@test.com',
 '$2a$10$rOzN0VFq0XVhM1Dx5vQ7bOcFq1MK7s0s0N5o0L6xR4Hl6Xm1xHkMG',
 '+54 11 5555-0101', 'Perder peso y tonificar', 'active', '2026-01-15',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria', 'ROLE_CLIENT'),
('client-2', 'Carlos Ruiz', 'carlos@test.com',
 '$2a$10$rOzN0VFq0XVhM1Dx5vQ7bOcFq1MK7s0s0N5o0L6xR4Hl6Xm1xHkMG',
 '+54 11 5555-0102', 'Ganar masa muscular', 'active', '2026-02-01',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos', 'ROLE_CLIENT'),
('client-3', 'Lucía Fernández', 'lucia@test.com',
 '$2a$10$rOzN0VFq0XVhM1Dx5vQ7bOcFq1MK7s0s0N5o0L6xR4Hl6Xm1xHkMG',
 '+54 11 5555-0103', 'Mejorar resistencia', 'active', '2026-03-10',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucia', 'ROLE_CLIENT'),
('client-4', 'Pedro Díaz', 'pedro@test.com',
 '$2a$10$rOzN0VFq0XVhM1Dx5vQ7bOcFq1MK7s0s0N5o0L6xR4Hl6Xm1xHkMG',
 '+54 11 5555-0104', 'Definición muscular', 'active', '2026-04-20',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro', 'ROLE_CLIENT')
ON CONFLICT (id) DO NOTHING;

-- ── Plantillas de rutina (3) ─────────────────────────────────────────────────
INSERT INTO routine_templates (id, name, goal, description, exercises, created_at) VALUES
('rt-1', 'Rutina Principiante', 'fullbody',
 'Rutina full-body para quienes recién empiezan. 3 días por semana.',
 '[{"id":"ex-1","name":"Sentadillas","sets":3,"reps":12,"rest":"60s","notes":"Sin peso","videoUrl":"https://example.com/squat"},
   {"id":"ex-2","name":"Press de pecho con mancuernas","sets":3,"reps":10,"rest":"60s","notes":"Peso moderado","videoUrl":"https://example.com/bench"},
   {"id":"ex-3","name":"Remo con barra","sets":3,"reps":10,"rest":"60s","notes":"Espalda recta","videoUrl":""},
   {"id":"ex-4","name":"Plancha","sets":3,"reps":30,"rest":"30s","notes":"Segundos","videoUrl":""},
   {"id":"ex-5","name":"Curl de bíceps","sets":3,"reps":12,"rest":"45s","notes":"Controlado","videoUrl":""}]',
 '2026-01-01'),
('rt-2', 'Rutina Intermedia', 'hipertrofia',
 'Rutina dividida en tren superior e inferior. 4-5 días por semana.',
 '[{"id":"ex-6","name":"Press banca con barra","sets":4,"reps":8,"rest":"90s","notes":"Progresivo","videoUrl":""},
   {"id":"ex-7","name":"Peso muerto","sets":3,"reps":8,"rest":"120s","notes":"Técnica primero","videoUrl":""},
   {"id":"ex-8","name":"Sentadilla búlgara","sets":4,"reps":10,"rest":"60s","notes":"Por pierna","videoUrl":""},
   {"id":"ex-9","name":"Press militar","sets":4,"reps":8,"rest":"90s","notes":"De pie","videoUrl":""},
   {"id":"ex-10","name":"Dominadas","sets":3,"reps":8,"rest":"60s","notes":"Hasta el fallo","videoUrl":""},
   {"id":"ex-11","name":"Zancadas","sets":3,"reps":12,"rest":"60s","notes":"Alternando piernas","videoUrl":""}]',
 '2026-01-01'),
('rt-3', 'Rutina Avanzada', 'hipertrofia-avanzado',
 'Rutina de alto volumen para atletas experimentados. 6 días PPL.',
 '[{"id":"ex-12","name":"Sentadilla trasera","sets":5,"reps":5,"rest":"120s","notes":"Carga pesada","videoUrl":""},
   {"id":"ex-13","name":"Press banca con pausa","sets":5,"reps":5,"rest":"120s","notes":"Pausa 2s en pecho","videoUrl":""},
   {"id":"ex-14","name":"Peso muerto rumano","sets":4,"reps":8,"rest":"90s","notes":"Isquios","videoUrl":""},
   {"id":"ex-15","name":"Hip thrust","sets":4,"reps":10,"rest":"60s","notes":"Glúteo","videoUrl":""},
   {"id":"ex-16","name":"Remo pendlay","sets":4,"reps":6,"rest":"90s","notes":"Explosivo","videoUrl":""},
   {"id":"ex-17","name":"Press de hombros + Elevaciones","sets":3,"reps":12,"rest":"45s","notes":"Superserie","videoUrl":""}]',
 '2026-01-01')
ON CONFLICT (id) DO NOTHING;

-- ── Rutinas asignadas (3) — creadas a partir de templates ────────────────────
INSERT INTO routines (id, name, goal, template_id, exercises, created_at) VALUES
('routine-1', 'Rutina Inicial María', 'fullbody', 'rt-1',
 '[{"id":"ex-1","name":"Sentadillas","sets":3,"reps":12,"rest":"60s","notes":"Sin peso","videoUrl":"https://example.com/squat"},
   {"id":"ex-2","name":"Press de pecho con mancuernas","sets":3,"reps":10,"rest":"60s","notes":"Peso moderado","videoUrl":"https://example.com/bench"},
   {"id":"ex-3","name":"Remo con barra","sets":3,"reps":10,"rest":"60s","notes":"Espalda recta","videoUrl":""},
   {"id":"ex-4","name":"Plancha","sets":3,"reps":30,"rest":"30s","notes":"Segundos","videoUrl":""}]',
 '2026-01-20'),
('routine-2', 'Rutina Intermedia Carlos', 'hipertrofia', 'rt-2',
 '[{"id":"ex-6","name":"Press banca con barra","sets":4,"reps":8,"rest":"90s","notes":"Progresivo","videoUrl":""},
   {"id":"ex-7","name":"Peso muerto","sets":3,"reps":8,"rest":"120s","notes":"Técnica primero","videoUrl":""},
   {"id":"ex-9","name":"Press militar","sets":4,"reps":8,"rest":"90s","notes":"De pie","videoUrl":""},
   {"id":"ex-10","name":"Dominadas","sets":3,"reps":8,"rest":"60s","notes":"Hasta el fallo","videoUrl":""}]',
 '2026-02-05'),
('routine-3', 'Rutina Resistencia Lucía', 'fullbody', 'rt-1',
 '[{"id":"ex-1","name":"Sentadillas","sets":4,"reps":15,"rest":"45s","notes":"Ritmo constante","videoUrl":"https://example.com/squat"},
   {"id":"ex-4","name":"Plancha","sets":4,"reps":45,"rest":"30s","notes":"Segundos","videoUrl":""},
   {"id":"ex-5","name":"Curl de bíceps","sets":3,"reps":15,"rest":"30s","notes":"Circuito","videoUrl":""},
   {"id":"ex-11","name":"Zancadas","sets":3,"reps":12,"rest":"60s","notes":"Alternando piernas","videoUrl":""}]',
 '2026-03-15')
ON CONFLICT (id) DO NOTHING;

-- ── Plantillas de dieta (2) ──────────────────────────────────────────────────
INSERT INTO diet_templates (id, name, goal, description, indications, meals, created_at) VALUES
('dt-1', 'Plan Déficit Calórico', 'perdida-grasa',
 'Dieta baja en calorías para perder grasa sin perder músculo.',
 'Beber 2-3 litros de agua al día. No saltear comidas. Evitar azúcares refinados.',
 '[{"id":"meal-1","name":"Desayuno","content":"Avena integral (40g) con leche descremada y 1 fruta. Café sin azúcar."},
   {"id":"meal-2","name":"Almuerzo","content":"Pechuga de pollo a la plancha (150g) con verduras al vapor + quinoa (50g)."},
   {"id":"meal-3","name":"Colación","content":"Yogur natural descremado + 10 almendras."},
   {"id":"meal-4","name":"Cena","content":"Pescado al horno (150g) con ensalada verde + 1 rebanada de pan integral."}]',
 '2026-01-01'),
('dt-2', 'Plan Superávit Muscular', 'ganancia-muscular',
 'Dieta alta en proteína y carbohidratos para ganar masa muscular.',
 'Comer cada 3 horas. Aumentar agua a 3 litros. Batido post-entreno obligatorio.',
 '[{"id":"meal-5","name":"Desayuno","content":"4 huevos revueltos + 2 tostadas integrales + palta + vaso de leche entera."},
   {"id":"meal-6","name":"Media mañana","content":"Batido de proteína (1 scoop) con leche + banana."},
   {"id":"meal-7","name":"Almuerzo","content":"Bife de carne (200g) con batata (150g) y brócoli al vapor."},
   {"id":"meal-8","name":"Colación","content":"Arroz integral (100g) + atún al natural (1 lata) + aceite de oliva."},
   {"id":"meal-9","name":"Cena","content":"Pollo al horno con muslo (250g) + verduras asadas + arroz (80g)."},
   {"id":"meal-10","name":"Antes de dormir","content":"Caseína (1 scoop) con leche o requesón (100g) con nueces."}]',
 '2026-01-01')
ON CONFLICT (id) DO NOTHING;

-- ── Dietas asignadas (2) ─────────────────────────────────────────────────────
INSERT INTO diets (id, name, goal, template_id, indications, meals, created_at) VALUES
('diet-1', 'Dieta Déficit María', 'perdida-grasa', 'dt-1',
 'Beber 2-3 litros de agua al día. No saltear comidas. Evitar azúcares refinados.',
 '[{"id":"meal-1","name":"Desayuno","content":"Avena integral (40g) con leche descremada y 1 fruta. Café sin azúcar."},
   {"id":"meal-2","name":"Almuerzo","content":"Pechuga de pollo a la plancha (150g) con verduras al vapor + quinoa (50g)."},
   {"id":"meal-3","name":"Colación","content":"Yogur natural descremado + 10 almendras."},
   {"id":"meal-4","name":"Cena","content":"Pescado al horno (150g) con ensalada verde + 1 rebanada de pan integral."}]',
 '2026-01-20'),
('diet-2', 'Dieta Volumen Carlos', 'ganancia-muscular', 'dt-2',
 'Comer cada 3 horas. Aumentar agua a 3 litros. Batido post-entreno obligatorio.',
 '[{"id":"meal-5","name":"Desayuno","content":"4 huevos revueltos + 2 tostadas integrales + palta + vaso de leche entera."},
   {"id":"meal-7","name":"Almuerzo","content":"Bife de carne (200g) con batata (150g) y brócoli al vapor."},
   {"id":"meal-9","name":"Cena","content":"Pollo al horno con muslo (250g) + verduras asadas + arroz (80g)."}]',
 '2026-02-05')
ON CONFLICT (id) DO NOTHING;

-- ── Asignaciones ──────────────────────────────────────────────────────────────
INSERT INTO assignments (id, client_id, routine_id, diet_id, assigned_at, active) VALUES
('asg-1', 'client-1', 'routine-1', 'diet-1', '2026-01-20 10:00:00', true),
('asg-2', 'client-2', 'routine-2', 'diet-2', '2026-02-05 10:00:00', true),
('asg-3', 'client-3', 'routine-3', NULL, '2026-03-15 10:00:00', true)
ON CONFLICT (id) DO NOTHING;

-- ── Notas del coach ───────────────────────────────────────────────────────────
INSERT INTO notes (id, client_id, coach_id, text, created_at, updated_at) VALUES
('note-1', 'client-1', 'coach-1', 'Excelente actitud. Aumentar peso en sentadillas.', '2026-02-01 14:00:00', '2026-02-01 14:00:00'),
('note-2', 'client-1', 'coach-1', 'Recordar hidratación durante el entrenamiento.', '2026-02-15 09:30:00', '2026-02-15 09:30:00'),
('note-3', 'client-2', 'coach-1', 'Mantener intensidad en peso muerto.', '2026-03-01 11:00:00', '2026-03-01 11:00:00'),
('note-4', 'client-3', 'coach-1', 'Progresar de peso gradualmente.', '2026-04-01 10:00:00', '2026-04-01 10:00:00')
ON CONFLICT (id) DO NOTHING;

-- ── Progreso de peso ─────────────────────────────────────────────────────────
INSERT INTO progress (id, client_id, date, weight, comment) VALUES
('prog-1', 'client-1', '2026-01-15', 72.5, 'Peso inicial'),
('prog-2', 'client-1', '2026-02-01', 71.2, 'Semana 2'),
('prog-3', 'client-1', '2026-03-01', 69.8, 'Progreso mes 2'),
('prog-4', 'client-1', '2026-04-01', 68.5, 'Bajando bien'),
('prog-5', 'client-1', '2026-05-01', 67.3, 'Mes 5'),
('prog-6', 'client-1', '2026-06-01', 66.0, 'Objetivo cerca'),
('prog-7', 'client-2', '2026-02-01', 78.0, 'Peso inicial'),
('prog-8', 'client-2', '2026-03-01', 79.2, 'Subiendo músculo'),
('prog-9', 'client-2', '2026-04-01', 80.5, 'Ganancia limpia'),
('prog-10', 'client-3', '2026-03-10', 60.0, 'Peso inicial'),
('prog-11', 'client-3', '2026-04-10', 59.5, 'Estable')
ON CONFLICT (id) DO NOTHING;

-- ── Hilos de nutrición ───────────────────────────────────────────────────────
INSERT INTO nutrition_threads (id, client_id, messages, created_at, updated_at) VALUES
('thread-1', 'client-1', '[
  {"role":"user","content":"¿Puedo reemplazar el pollo por tofu?","timestamp":"2026-02-10T10:00:00"},
  {"role":"assistant","content":"Sí, el tofu firme es una excelente alternativa proteica. Asegurate de marinarlo.","timestamp":"2026-02-10T10:01:00"},
  {"role":"user","content":"¿Cuánto tofu necesito para reemplazar 150g de pollo?","timestamp":"2026-02-10T10:05:00"},
  {"role":"assistant","content":"Aproximadamente 180-200g de tofu firme te aportan una cantidad similar de proteína. Acompañalo con legumbres para un perfil aminoacídico completo.","timestamp":"2026-02-10T10:06:00"}
]'::jsonb, '2026-02-10 10:00:00', '2026-02-10 10:06:00'),
('thread-2', 'client-2', '[
  {"role":"user","content":"¿Qué batido recomendas post-entreno?","timestamp":"2026-03-01T08:00:00"},
  {"role":"assistant","content":"Un batido con proteína whey, banana, avena y leche entera es ideal para recuperación y ganancia.","timestamp":"2026-03-01T08:01:00"}
]'::jsonb, '2026-03-01 08:00:00', '2026-03-01 08:01:00')
ON CONFLICT (id) DO NOTHING;

-- ── Productos (8) ────────────────────────────────────────────────────────────
INSERT INTO products (id, name, description, price, image, category, stock) VALUES
('prod-1', 'Whey Protein 1kg', 'Proteína de suero de leche sabor chocolate. 25g de proteína por scoop.', 18500.00, '/products/whey.png', 'suplementos', 50),
('prod-2', 'Creatina Monohidratada 300g', 'Creatina pura micronizada. Sin sabor. 5g por porción.', 9500.00, '/products/creatine.png', 'suplementos', 80),
('prod-3', 'Bandas de Resistencia Set x3', 'Tres niveles de resistencia: baja, media y alta. Incluye bolso.', 7500.00, '/products/bands.png', 'accesorios', 30),
('prod-4', 'Rodilleras de Compresión Par', 'Soporte para sentadillas y levantamiento. Par anti-deslizante.', 6200.00, '/products/kneesleeves.png', 'accesorios', 40),
('prod-5', 'Shaker Pro 700ml', 'Vaso mezclador con tamiz metálico y compartimento para suplementos.', 4500.00, '/products/shaker.png', 'accesorios', 100),
('prod-6', 'Guantes de Entrenamiento', 'Guantes con muñequera y agarre de silicona. Transpirables.', 5200.00, '/products/gloves.png', 'accesorios', 45),
('prod-7', 'Barra para Dominadas', 'Barra extensible para puerta. Capacidad 130kg. Instalación sin tornillos.', 8900.00, '/products/pullupbar.png', 'equipamiento', 25),
('prod-8', 'Rueda Abdominal', 'Rueda doble con rodilleras incluidas. Entrenamiento de core.', 3800.00, '/products/abwheel.png', 'equipamiento', 60)
ON CONFLICT (id) DO NOTHING;

-- ── Planes (3) ────────────────────────────────────────────────────────────────
INSERT INTO plans (id, name, subtitle, price, currency, features, featured) VALUES
('plan-basic', 'Plan Básico', 'Para empezar tu camino fitness', 5000, 'ARS', 
 '["Acceso a rutinas personalizadas","Plan de alimentación básico","Seguimiento de progreso","Chat con coach 1 vez por semana"]'::jsonb,
 false),
('plan-pro', 'Plan Pro', 'El más elegido', 9000, 'ARS',
 '["Todo lo del Plan Básico","Rutina actualizada cada 2 semanas","Plan nutricional completo con recetas","Chat ilimitado con coach","Videollamada mensual","Acceso a tienda con descuentos"]'::jsonb,
 true),
('plan-pro-plus', 'Plan Pro+', 'La experiencia completa', 15000, 'ARS',
 '["Todo lo del Plan Pro","Coach dedicado 24/7","Rutina semanal personalizada","Análisis de composición corporal","Suplementación guiada","Descuento del 20% en tienda"]'::jsonb,
 false)
ON CONFLICT (id) DO NOTHING;
