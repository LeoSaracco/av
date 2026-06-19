-- V10: Reinsert test clients deleted during testing + normalise status to lowercase.
-- Uses ON CONFLICT DO NOTHING so existing clients are not affected.

-- Fix status case for any remaining seed clients
UPDATE clients SET status = 'activo' WHERE status = 'ACTIVO';
UPDATE clients SET status = 'pausado' WHERE status = 'PAUSADO';
UPDATE clients SET status = 'inactivo' WHERE status = 'INACTIVO';

-- Reinsert clients (ON CONFLICT: skip if already exist)
INSERT INTO clients (id, name, email, phone, goal, status, join_date) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Martina Gomez', 'martina@gmail.com',
   '+54 11 4523-8891', 'Perder 8 kg y tonificar piernas y gluteos', 'activo', '2025-09-15'),
  ('22222222-2222-2222-2222-222222222222', 'Lucas Fernandez', 'lucas.fit@gmail.com',
   '+54 11 3312-0045', 'Ganar masa muscular, alcanzar 80 kg de masa magra', 'activo', '2025-10-01'),
  ('33333333-3333-3333-3333-333333333333', 'Sofia Herrera', 'sofia.h@outlook.com',
   '+54 11 6781-2234', 'Mejorar rendimiento en running, bajar 10k a 48 min', 'activo', '2025-11-10'),
  ('44444444-4444-4444-4444-444444444444', 'Diego Ramirez', 'diego.ram@gmail.com',
   '+54 11 5590-3312', 'Rehabilitacion de espalda baja y ganar movilidad', 'pausado', '2025-08-20')
ON CONFLICT (id) DO NOTHING;

-- Reinsert client users (password: 1234)
INSERT INTO users (id, role, name, email, password_hash, client_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'CLIENT', 'Martina Gomez', 'martina@gmail.com',
   '$2a$12$LJ3m4ys3GZfnYk.UbCGsG.6GKpPlYpCKZBPEpXX1dp3BJF4T5K7Hy', '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222', 'CLIENT', 'Lucas Fernandez', 'lucas.fit@gmail.com',
   '$2a$12$LJ3m4ys3GZfnYk.UbCGsG.6GKpPlYpCKZBPEpXX1dp3BJF4T5K7Hy', '22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-333333333333', 'CLIENT', 'Sofia Herrera', 'sofia.h@outlook.com',
   '$2a$12$LJ3m4ys3GZfnYk.UbCGsG.6GKpPlYpCKZBPEpXX1dp3BJF4T5K7Hy', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;
