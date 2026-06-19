-- Seed Coach (password: coach123, BCrypt hash)
INSERT INTO coaches (id, name, email, password_hash) VALUES
('a1111111-1111-1111-1111-111111111111', 'Adrian Vila', 'adrian@av.com',
 '$2a$12$LJ3m4ys3GZfnYk.UbCGsG.6GKpPlYpCKZBPEpXX1dp3BJF4T5K7Hy');

INSERT INTO users (id, role, name, email, password_hash) VALUES
('a1111111-1111-1111-1111-111111111111', 'COACH', 'Adrian Vila', 'adrian@av.com',
 '$2a$12$LJ3m4ys3GZfnYk.UbCGsG.6GKpPlYpCKZBPEpXX1dp3BJF4T5K7Hy');

-- Seed Clients
INSERT INTO clients (id, name, email, phone, goal, status, join_date) VALUES
('11111111-1111-1111-1111-111111111111', 'Martina Gomez', 'martina@gmail.com',
 '+54 11 4523-8891', 'Perder 8 kg y tonificar piernas y gluteos', 'ACTIVO', '2025-09-15'),
('22222222-2222-2222-2222-222222222222', 'Lucas Fernandez', 'lucas.fit@gmail.com',
 '+54 11 3312-0045', 'Ganar masa muscular, alcanzar 80 kg de masa magra', 'ACTIVO', '2025-10-01'),
('33333333-3333-3333-3333-333333333333', 'Sofia Herrera', 'sofia.h@outlook.com',
 '+54 11 6781-2234', 'Mejorar rendimiento en running, bajar 10k a 48 min', 'ACTIVO', '2025-11-10'),
('44444444-4444-4444-4444-444444444444', 'Diego Ramirez', 'diego.ram@gmail.com',
 '+54 11 5590-3312', 'Rehabilitacion de espalda baja y ganar movilidad', 'PAUSADO', '2025-08-20');

-- Seed Client Users (password: 1234)
INSERT INTO users (id, role, name, email, password_hash, client_id) VALUES
('11111111-1111-1111-1111-111111111111', 'CLIENT', 'Martina Gomez', 'martina@gmail.com',
 '$2a$12$LJ3m4ys3GZfnYk.UbCGsG.6GKpPlYpCKZBPEpXX1dp3BJF4T5K7Hy', '11111111-1111-1111-1111-111111111111'),
('22222222-2222-2222-2222-222222222222', 'CLIENT', 'Lucas Fernandez', 'lucas.fit@gmail.com',
 '$2a$12$LJ3m4ys3GZfnYk.UbCGsG.6GKpPlYpCKZBPEpXX1dp3BJF4T5K7Hy', '22222222-2222-2222-2222-222222222222'),
('33333333-3333-3333-3333-333333333333', 'CLIENT', 'Sofia Herrera', 'sofia.h@outlook.com',
 '$2a$12$LJ3m4ys3GZfnYk.UbCGsG.6GKpPlYpCKZBPEpXX1dp3BJF4T5K7Hy', '33333333-3333-3333-3333-333333333333');

-- Seed Routine Templates
INSERT INTO routine_templates (id, name, goal, description, exercises, created_at) VALUES
('71111111-1111-1111-1111-111111111111', 'Full Body Hipertrofia 3x',
 'Ganar masa muscular general',
 'Rutina de 3 dias por semana enfocada en hipertrofia general con ejercicios compuestos.',
 '[{"id":"e1111111-1111-1111-1111-111111111111","name":"Sentadilla libre","sets":4,"reps":10,"rest":"90s","notes":"Profundidad paralela, rodillas hacia afuera","videoUrl":""},{"id":"e2222222-2222-2222-2222-222222222222","name":"Press de banca plano","sets":4,"reps":10,"rest":"75s","notes":"Retraccion escapular, tocar pecho","videoUrl":""},{"id":"e3333333-3333-3333-3333-333333333333","name":"Remo con barra","sets":4,"reps":10,"rest":"75s","notes":"Espalda recta, tirar con codos","videoUrl":""},{"id":"e4444444-4444-4444-4444-444444444444","name":"Peso muerto rumano","sets":3,"reps":12,"rest":"90s","notes":"Rodillas semiflexionadas, cadera atras","videoUrl":""},{"id":"e5555555-5555-5555-5555-555555555555","name":"Press militar","sets":3,"reps":12,"rest":"60s","notes":"Sin arquear la espalda","videoUrl":""}]',
 '2025-09-01'),
('72222222-2222-2222-2222-222222222222', 'Cardio + Fuerza Funcional',
 'Quemar grasa y mejorar condicion fisica general',
 'Circuito de alta intensidad combinando ejercicios de fuerza con intervalos de cardio.',
 '[{"id":"e6666666-6666-6666-6666-666666666666","name":"Burpees","sets":3,"reps":15,"rest":"30s","notes":"Pecho al suelo, salto completo","videoUrl":""},{"id":"e7777777-7777-7777-7777-777777777777","name":"Kettlebell Swing","sets":3,"reps":20,"rest":"45s","notes":"Impulso de cadera, no de brazos","videoUrl":""},{"id":"e8888888-8888-8888-8888-888888888888","name":"Box Jump","sets":3,"reps":10,"rest":"45s","notes":"Aterrizaje suave, caer en sentadilla","videoUrl":""},{"id":"e9999999-9999-9999-9999-999999999999","name":"Battle Ropes","sets":3,"reps":30,"rest":"30s","notes":"Ondas constantes, core activado","videoUrl":""}]',
 '2025-09-05'),
('73333333-3333-3333-3333-333333333333', 'Definicion Avanzada',
 'Definicion muscular y reduccion de grasa corporal',
 'Superseries y circuitos de alta densidad para maximizar el gasto calorico manteniendo masa muscular.',
 '[{"id":"eaaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","name":"Dominadas lastradas","sets":4,"reps":8,"rest":"60s","notes":"Rango completo, menton sobre barra","videoUrl":""},{"id":"ebbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","name":"Fondos en paralelas","sets":4,"reps":10,"rest":"60s","notes":"90 grados en codo, no balancear","videoUrl":""},{"id":"ecccccccc-cccc-cccc-cccc-cccccccccccc","name":"Sentadilla bulgara","sets":3,"reps":12,"rest":"60s","notes":"Pie trasero elevado, rodilla delantera no pasa punta","videoUrl":""}]',
 '2025-09-10');

-- Seed Routines
INSERT INTO routines (id, name, goal, template_id, exercises, created_at) VALUES
('81111111-1111-1111-1111-111111111111', 'Full Body Hipertrofia 4x10',
 'Ganar tono muscular y fuerza general', '71111111-1111-1111-1111-111111111111',
 '[{"id":"e1b11111-1111-1111-1111-111111111111","name":"Sentadilla libre","sets":4,"reps":10,"rest":"90s","notes":"Profundidad paralela, rodillas hacia afuera","videoUrl":""},{"id":"e2b11111-1111-1111-1111-111111111111","name":"Press de banca plano","sets":4,"reps":10,"rest":"75s","notes":"Retraccion escapular, tocar pecho","videoUrl":""},{"id":"e3b11111-1111-1111-1111-111111111111","name":"Remo con barra","sets":4,"reps":10,"rest":"75s","notes":"Espalda recta, tirar con codos","videoUrl":""},{"id":"e4b11111-1111-1111-1111-111111111111","name":"Peso muerto rumano","sets":3,"reps":12,"rest":"90s","notes":"Rodillas semiflexionadas, cadera atras","videoUrl":""},{"id":"e5b11111-1111-1111-1111-111111111111","name":"Press militar","sets":3,"reps":12,"rest":"60s","notes":"Sin arquear la espalda","videoUrl":""}]',
 '2025-09-20'),
('82222222-2222-2222-2222-222222222222', 'Hipertrofia Intensa 5x8',
 'Maxima ganancia de masa muscular', '71111111-1111-1111-1111-111111111111',
 '[{"id":"e1c11111-1111-1111-1111-111111111111","name":"Sentadilla libre","sets":5,"reps":8,"rest":"120s","notes":"Profundidad maxima, con pausa abajo","videoUrl":""},{"id":"e2c11111-1111-1111-1111-111111111111","name":"Press de banca","sets":5,"reps":8,"rest":"90s","notes":"Arco moderado, tocar pecho","videoUrl":""},{"id":"e3c11111-1111-1111-1111-111111111111","name":"Remo Pendlay","sets":4,"reps":8,"rest":"90s","notes":"Explosivo, desde peso muerto","videoUrl":""},{"id":"e4c11111-1111-1111-1111-111111111111","name":"Peso muerto convencional","sets":3,"reps":5,"rest":"120s","notes":"Barra pegada a las piernas, activar dorsal","videoUrl":""}]',
 '2025-10-05'),
('83333333-3333-3333-3333-333333333333', 'Circuito HIIT + Funcional 4x15',
 'Mejorar capacidad aerobica y fuerza funcional para running',
 '72222222-2222-2222-2222-222222222222',
 '[{"id":"e1d11111-1111-1111-1111-111111111111","name":"Circuito HIIT","sets":4,"reps":15,"rest":"30s","notes":"30s trabajo, 15s descanso","videoUrl":""},{"id":"e2d11111-1111-1111-1111-111111111111","name":"Zancadas con salto","sets":3,"reps":12,"rest":"45s","notes":"Rodilla no toca suelo, salto explosivo","videoUrl":""},{"id":"e3d11111-1111-1111-1111-111111111111","name":"Plancha dinamica","sets":3,"reps":10,"rest":"30s","notes":"Hombro sobre muneca, core firme","videoUrl":""},{"id":"e4d11111-1111-1111-1111-111111111111","name":"Sentadilla búlgara","sets":3,"reps":12,"rest":"60s","notes":"Pie trasero elevado, equilibrio","videoUrl":""}]',
 '2025-11-15');

-- Seed Assignments
INSERT INTO assignments (id, client_id, routine_id, assigned_at, active) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
 '81111111-1111-1111-1111-111111111111', '2025-09-20', true),
('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
 '82222222-2222-2222-2222-222222222222', '2025-10-05', true),
('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333',
 '83333333-3333-3333-3333-333333333333', '2025-11-15', true);

-- Seed Notes
INSERT INTO notes (id, client_id, text, created_at, updated_at) VALUES
('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
 'Martina esta progresando muy bien en las sentadillas. Aumentamos carga 5kg esta semana. Buena retroalimentacion sobre la dieta, dice que las meriendas le ayudan a no picar.', '2025-11-10', '2025-11-10'),
('b2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
 'Le cuesta el press de banca, revisar tecnica. Le di correcciones para la proxima sesion.', '2025-11-24', '2025-11-24'),
('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222',
 'Lucas esta cumpliendo con todas las cargas. Excelente adhesion. Aumentar peso muerto para la proxima.', '2025-11-05', '2025-11-05'),
('b4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222',
 'Revisar tecnica de remo con barra, tiende a encorvar la espalda en las ultimas repeticiones.', '2025-11-19', '2025-11-19'),
('b5555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333',
 'Sofia bajo 2 minutos en su 10k. El entrenamiento funcional esta dando resultados. Ajustar dieta pre-competencia.', '2025-11-20', '2025-11-20');

-- Seed Progress
INSERT INTO progress_entries (id, client_id, date, weight, comment) VALUES
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '2025-09-15', 67.5, 'Inicio del programa.'),
('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '2025-09-29', 67.0, 'Baje un poco, me siento con mas energia.'),
('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '2025-10-13', 66.2, 'La dieta me esta ayudando, note la ropa mas holgada.'),
('c4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '2025-10-27', 65.5, 'Estoy muy motivada, casi 2 kg en mes y medio.'),
('c5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '2025-11-10', 64.8, 'Llegue a 64.8, estoy cerca del objetivo.'),
('c6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', '2025-11-24', 64.3, 'Animo por las nubes, la rutina de ejercicios me encanta.'),
('c7777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', '2025-10-01', 73.5, 'Peso inicial, meta 80 kg.'),
('c8888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', '2025-10-15', 74.2, 'Subi casi un kilo, se nota en los brazos.'),
('c9999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', '2025-10-29', 75.0, 'Los press de banca estan rindiendo.'),
('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', '2025-11-12', 76.1, 'Compre mas pollo y huevos, aumente la ingesta calorica.'),
('cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', '2025-11-26', 77.1, 'Excelente progreso, casi 4 kg desde inicio.'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '2025-11-10', 58.0, 'Inicio de seguimiento.'),
('cddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', '2025-11-24', 57.3, 'Bajando de a poco sin perder rendimiento.');

-- Seed Diet Templates
INSERT INTO diet_templates (id, name, goal, description, indications, meals, created_at) VALUES
('d1111111-1111-1111-1111-111111111111', 'Deficit Calorico General',
 'Perdida de peso y definicion',
 'Dieta estructurada en 4 comidas principales para generar un deficit calorico moderado manteniendo saciedad.',
 'Beber al menos 3 litros de agua por dia. Evitar bebidas azucaradas. Priorizar verduras de hoja verde en almuerzo y cena.',
 '[{"id":"m1111111-1111-1111-1111-111111111111","name":"Desayuno","content":"3 huevos revueltos, 1 tostada integral, cafe sin azucar"},{"id":"m2222222-2222-2222-2222-222222222222","name":"Almuerzo","content":"150g pechuga de pollo a la plancha, ensalada verde con aceite de oliva, 1/2 taza de arroz integral"},{"id":"m3333333-3333-3333-3333-333333333333","name":"Merienda","content":"Yogur griego natural, 1 fruta, 1 punado de nueces"},{"id":"m4444444-4444-4444-4444-444444444444","name":"Cena","content":"200g merluza al horno, brocoli y coliflor al vapor, 1/2 batata chica"}]',
 '2025-09-02'),
('d2222222-2222-2222-2222-222222222222', 'Volumen Limpio',
 'Aumento de masa muscular minimizando ganancia de grasa',
 'Aporte de carbohidratos complejos y proteinas magras orientado a ganancia muscular limpia con 5 comidas diarias.',
 'El timing de los carbohidratos es clave: cargarlos alrededor del entrenamiento. Suplementar con creatina 5g diarios post-entreno.',
 '[{"id":"m5555555-5555-5555-5555-555555555555","name":"Desayuno","content":"Pancakes de avena (60g), 2 huevos, banana, miel"},{"id":"m6666666-6666-6666-6666-666666666666","name":"Media Manana","content":"Batido de proteina (1 scoop), 30g avena, leche descremada"},{"id":"m7777777-7777-7777-7777-777777777777","name":"Almuerzo","content":"200g carne vacuna magra, 200g batata, ensalada de tomate y pepino"},{"id":"m8888888-8888-8888-8888-888888888888","name":"Merienda pre-entreno","content":"2 tostadas integrales con pasta de mani, 1 fruta, cafe negro"},{"id":"m9999999-9999-9999-9999-999999999999","name":"Cena","content":"200g salmon, 1 taza quinoa, esparragos grillados"}]',
 '2025-09-06');

-- Seed Diets
INSERT INTO diets (id, name, goal, template_id, indications, meals, created_at) VALUES
('d1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Deficit Calorico - Martina', 'Perdida de peso y definicion',
 'd1111111-1111-1111-1111-111111111111',
 'Agregamos una colacion si sentis hambre entre comidas. Podes variar entre pollo y pescado.',
 '[{"id":"m1b11111-1111-1111-1111-111111111111","name":"Desayuno","content":"3 huevos revueltos, 1 tostada integral, cafe sin azucar"},{"id":"m2b11111-1111-1111-1111-111111111111","name":"Almuerzo","content":"150g pechuga de pollo a la plancha, ensalada verde con aceite de oliva, 1/2 taza de arroz integral"},{"id":"m3b11111-1111-1111-1111-111111111111","name":"Merienda","content":"Yogur griego natural, 1 fruta, 1 punado de nueces"},{"id":"m4b11111-1111-1111-1111-111111111111","name":"Cena","content":"200g merluza al horno, brocoli y coliflor al vapor, 1/2 batata chica"}]',
 '2025-09-21'),
('d2aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Volumen Ajustado - Lucas', 'Maxima ganancia limpia',
 'd2222222-2222-2222-2222-222222222222',
 'Aumentamos calorias respecto a la plantilla base. Agregamos una comida extra para llegar a superavit.',
 '[{"id":"m5b11111-1111-1111-1111-111111111111","name":"Desayuno","content":"Pancakes de avena (80g), 3 huevos, banana, miel"},{"id":"m6b11111-1111-1111-1111-111111111111","name":"Media Manana","content":"Batido de proteina (1.5 scoops), 40g avena, leche descremada"},{"id":"m7b11111-1111-1111-1111-111111111111","name":"Almuerzo","content":"250g carne vacuna magra, 250g batata, ensalada de tomate y pepino"},{"id":"m8b11111-1111-1111-1111-111111111111","name":"Merienda pre-entreno","content":"3 tostadas integrales con pasta de mani, 1 fruta, cafe negro"},{"id":"m9b11111-1111-1111-1111-111111111111","name":"Cena","content":"250g salmon, 1.5 taza quinoa, esparragos grillados"}]',
 '2025-10-06');

-- Seed Diet Assignments
INSERT INTO diet_assignments (id, client_id, diet_id, assigned_at, active) VALUES
('da111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
 'd1aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2025-09-21', true),
('da222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
 'd2aaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2025-10-06', true);

-- Seed Nutrition Threads
INSERT INTO nutrition_threads (id, client_id, messages) VALUES
('e1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
 '[{"id":"msg11111-1111-1111-1111-111111111111","sender":"COACH","text":"Martina, aca te dejo tu nuevo plan nutricional. Cualquier duda avisame.","date":"2025-09-21T10:00:00"},{"id":"msg22222-2222-2222-2222-222222222222","sender":"CLIENT","text":"Gracias profe! Una pregunta: puedo cambiar la merienda por un batido de proteinas los dias que entreno?","date":"2025-09-21T11:30:00"},{"id":"msg33333-3333-3333-3333-333333333333","sender":"COACH","text":"Si, sin problema. Usa 1 scoop con agua o leche descremada. No le agregues fruta porque ya tenes carbohidratos en la cena.","date":"2025-09-21T14:00:00"}]'),
('e2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
 '[{"id":"msg44444-4444-4444-4444-444444444444","sender":"COACH","text":"Lucas, este es el plan de volumen limpio. Respetar los horarios de las comidas.","date":"2025-10-06T09:00:00"},{"id":"msg55555-5555-5555-5555-555555555555","sender":"CLIENT","text":"Perfecto Adriaaan! Tengo una consulta: los dias que no entreno, bajo los carbohidratos o mantengo?","date":"2025-10-06T11:00:00"},{"id":"msg66666-6666-6666-6666-666666666666","sender":"COACH","text":"Los dias de descanso podes bajar un poco la avena y la batata, pero manten las proteinas. El cuerpo sigue necesitando recuperacion.","date":"2025-10-06T15:00:00"}]');

-- Seed Plans
INSERT INTO plans (id, name, subtitle, price, currency, features, featured) VALUES
('f1111111-1111-1111-1111-111111111111', 'Plan Entrenamiento', 'Rutina + seguimiento', 9900, 'ARS',
 '["Rutina personalizada segun tu nivel","Ajustes cada 15 dias","Seguimiento semanal por WhatsApp","Acceso a App de ejercicios","Soporte de L a V de 9 a 18"]', false),
('f2222222-2222-2222-2222-222222222222', 'Metodo 90/90', 'Entrenamiento + Nutricion', 14900, 'ARS',
 '["Todo lo del Plan Entrenamiento","Plan nutricional personalizado","Asistente IA 24/7","Seguimiento biometrico","Recetario exclusivo AV","Comunidad privada de atletas"]', true),
('f3333333-3333-3333-3333-333333333333', 'Plan Personalizado', '1-on-1 con Adrian', 24900, 'ARS',
 '["Todo lo del Metodo 90/90","Sesiones 1-on-1 semanales","Evaluacion presencial mensual","Protocolo de lesion y recuperacion","Plan de suplementacion","Prioridad maxima de respuesta"]', false);

-- Seed Products
INSERT INTO products (id, category, name, description, price, sizes, colors, stock) VALUES
('91111111-1111-1111-1111-111111111111', 'Ropa', 'Remera Entrenamiento AV', 'Remera de algodon peinado con tecnologia Dry Fit. Logo AV en el pecho. Ideal para entrenamientos de fuerza y cardio.', 4500, '["XS","S","M","L","XL"]', '["Negro","Blanco","Verde"]', 25),
('92222222-2222-2222-2222-222222222222', 'Ropa', 'Calza Compresion Pro', 'Calza de compression media con refuerzo en rodillas. Costura plana para evitar rozaduras. Cintura alta con bolsillo oculto.', 6900, '["S","M","L","XL"]', '["Negro","Verde Oscuro"]', 20),
('93333333-3333-3333-3333-333333333333', 'Ropa', 'Buzo Oversize AV', 'Buzo oversize de frisa premium. Capucha con cordon, bolsillo kanguro. Ideal para pre y post entreno.', 8500, '["S","M","L","XL"]', '["Negro/Verde","Negro/Blanco"]', 15);

INSERT INTO products (id, category, name, description, price, flavors, stock) VALUES
('94444444-4444-4444-4444-444444444444', 'Suplementos', 'Creatina Monohidrato 500g', 'Creatina monohidrato micronizada de maxima pureza. Sin agregados, sin sabor. Testeada en laboratorio.', 9800, '["Sin sabor"]', 30),
('95555555-5555-5555-5555-555555555555', 'Suplementos', 'Proteina Whey Isolate 1kg', 'Aislado de proteina de suero de leche. 27g de proteina por scoop. Baja en lactosa, alta en BCAA.', 18500, '["Chocolate","Vainilla","Frutilla"]', 18),
('96666666-6666-6666-6666-666666666666', 'Suplementos', 'Pre-Workout Explosivo 300g', 'Pre-entreno con beta-alanina, citrulina, arginina y 200mg de cafeina. Energia limpia y enfoque mental.', 12900, '["Sandia","Limon","Frutos Rojos"]', 12);

INSERT INTO products (id, category, name, description, price, colors, stock) VALUES
('97777777-7777-7777-7777-777777777777', 'Accesorios', 'Shaker AV Edicion Especial', 'Shaker de 700ml con compartimento para suplementos. Mezclador de malla metalica. Libre de BPA.', 3200, '["Negro","Verde Oscuro"]', 25),
('98888888-8888-8888-8888-888888888888', 'Accesorios', 'Cinturon de Lastre Pro', 'Cinturon de lastre con cadena regulable para dominadas y fondos. Soporta hasta 50kg. Acolchado lumbar.', 22000, '["Negro"]', 8);
