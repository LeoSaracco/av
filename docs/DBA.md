# DBA — Database Administration

Actualizado: 2026-06-19

Guía de administración de la base de datos PostgreSQL de AV Fitness.
Cubre esquema, índices, vistas, stored procedures, reglas de cascade,
y procedimientos de mantenimiento.

---

## Esquema de tablas

| # | Tabla | PK | FKs relevantes | Cascade |
|---|-------|----|----------------|---------|
| 1 | `coaches` | `id` | — | — |
| 2 | `clients` | `id` | — | — |
| 3 | `users` | `id` | `client_id → clients(id)` | `SET NULL` (V9) |
| 4 | `refresh_tokens` | `(user_id, token)` | `user_id → users(id)` | `CASCADE` |
| 5 | `routine_templates` | `id` | — | — |
| 6 | `routines` | `id` | `template_id → routine_templates(id)` | `SET NULL` |
| 7 | `assignments` | `id` | `client_id → clients(id)`, `routine_id → routines(id)` | `CASCADE`, `CASCADE` |
| 8 | `notes` | `id` | `client_id → clients(id)` | `CASCADE` |
| 9 | `progress_entries` | `id` | `client_id → clients(id)` | `CASCADE` |
| 10 | `diet_templates` | `id` | — | — |
| 11 | `diets` | `id` | `template_id → diet_templates(id)` | `SET NULL` |
| 12 | `diet_assignments` | `id` | `client_id → clients(id)`, `diet_id → diets(id)` | `CASCADE`, `CASCADE` |
| 13 | `nutrition_threads` | `id` | `client_id → clients(id)` UNIQUE | `CASCADE` |
| 14 | `onboarding_submissions` | `id` | `client_id → clients(id)` | `CASCADE` |
| 15 | `plans` | `id` | — | — |
| 16 | `products` | `id` | — | — |
| 17 | `payments` | `id` | `client_id → clients(id)`, `contract_id → plan_contracts(id)` | `CASCADE`, `SET NULL` |
| 18 | `plan_contracts` | `id` | `payment_id → payments(id)`, `onboarding_id → onboarding(id)`, `user_id → users(id)`, `client_id → clients(id)` | `SET NULL` todos |
| 19 | `audit_events` | `id` | `client_id`, `actor_user_id` — **sin FK** | — |
| 20 | `email_verification_tokens` | `id` | `email` — **sin FK** | — |

---

## Índices

### Existentes (22)

| Índice | Tabla | Columnas | Origen |
|--------|-------|----------|--------|
| `coaches_email_key` | coaches | `(email)` UNIQUE | V1 implícito |
| `clients_email_key` | clients | `(email)` UNIQUE | V1 implícito |
| `users_email_key` | users | `(email)` UNIQUE | V1 implícito |
| `refresh_tokens_token_key` | refresh_tokens | `(token)` UNIQUE | V1 implícito |
| `payments_preference_id_key` | payments | `(preference_id)` UNIQUE | V1 implícito |
| `nutrition_threads_client_id_key` | nutrition_threads | `(client_id)` UNIQUE | V1 implícito |
| `idx_assignments_client_active` | assignments | `(client_id, active)` | V1 |
| `idx_notes_client_id` | notes | `(client_id)` | V1 |
| `idx_progress_client_date` | progress_entries | `(client_id, date)` | V1 |
| `idx_diet_assignments_client_active` | diet_assignments | `(client_id, active)` | V1 |
| `idx_onboarding_email` | onboarding_submissions | `((form_data->>'email'))` | V1 |
| `idx_payments_preference` | payments | `(preference_id)` | V1 |
| `idx_payments_client` | payments | `(client_id)` | V1 |
| `idx_plan_contracts_status` | plan_contracts | `(status)` | V3 |
| `idx_plan_contracts_email` | plan_contracts | `(email)` | V3 |
| `idx_plan_contracts_client` | plan_contracts | `(client_id)` | V3 |
| `idx_payments_contract` | payments | `(contract_id)` | V3 |
| `idx_payments_external_reference` | payments | `(external_reference)` | V3 |
| `idx_audit_events_type_created` | audit_events | `(event_type, created_at)` | V3 |
| `idx_audit_events_aggregate` | audit_events | `(aggregate_type, aggregate_id)` | V3 |
| `idx_audit_events_client` | audit_events | `(client_id)` | V3 |
| `idx_email_verification_lookup_v2` | email_verification_tokens | `(email, code, used, expires_at)` | V14 |

### Agregados en V14

| Índice | Tabla | Columnas | Justificación |
|--------|-------|----------|---------------|
| `idx_notes_client_created` | notes | `(client_id, created_at DESC)` | Soporta `findByClientIdOrderByCreatedAtDesc` |
| `idx_email_verif_lookup_v2` | email_verification_tokens | `(email, code, used, expires_at)` | Reemplaza al anterior (no cubría `expires_at`) |

---

## Vistas

### `v_client_summary`

Vista unificada que junta clientes con rutina activa, dieta activa, y thread de nutrición. Útil para dashboards y reemplaza N+1 queries.

```sql
SELECT client_id, client_name, client_email, phone, goal, status,
       routine_id, routine_name, diet_id, diet_name,
       thread_id, thread_updated_at, thread_last_read_at
FROM v_client_summary;
```

### `v_unread_threads`

Hilos con mensajes no leídos por el coach, ordenados por más reciente. Para la campana de notificaciones.

```sql
SELECT * FROM v_unread_threads;
```

---

## Stored Procedures

### `sp_delete_client_by_email(target_email TEXT)`

Elimina un cliente y **todos** sus registros relacionados, incluso los que no tienen FK (audit_events, email_verification_tokens).

**Uso:**
```sql
SELECT sp_delete_client_by_email('leosaracco@gmail.com');
-- → "Cliente leosaracco@gmail.com eliminado. Contracts: 1, Payments: 1, ..."
```

**Qué elimina (en orden):**
1. `plan_contracts` (por email, sin FK)
2. `payments` (por client_id, cascade existe pero cuenta)
3. `onboarding_submissions` (por client_id)
4. `refresh_tokens` (por user_id)
5. `audit_events` (por client_id o actor_user_id)
6. `email_verification_tokens` (por email)
7. `users` (por email)
8. `clients` (por email → cascade: assignments, notes, progress, diet_assignments, nutrition_threads)

---

### `sp_cleanup_orphan_audits()`

Elimina registros de auditoría cuyo `client_id` ya no existe en la tabla `clients`.

```sql
SELECT sp_cleanup_orphan_audits();
-- → "3 audit_events huérfanos eliminados"
```

---

### `sp_cleanup_orphan_tokens()`

Elimina tokens de verificación de email que no pertenecen a ningún usuario o coach.

```sql
SELECT sp_cleanup_orphan_tokens();
-- → "1 tokens huérfanos eliminados"
```

---

## Guía de troubleshooting

### Eliminar un cliente problemático

```sql
-- Si el delete directo falla por FK:
SELECT sp_delete_client_by_email('email@problematico.com');
```

### Verificar datos huérfanos después de un delete manual

```sql
-- Audits sin cliente:
SELECT COUNT(*) FROM audit_events
WHERE client_id IS NOT NULL
  AND client_id NOT IN (SELECT id FROM clients);

-- Tokens sin usuario/coach:
SELECT COUNT(*) FROM email_verification_tokens
WHERE email NOT IN (SELECT email FROM users UNION SELECT email FROM coaches);
```

### Limpiar todos los huérfanos

```sql
SELECT sp_cleanup_orphan_audits();
SELECT sp_cleanup_orphan_tokens();
```

### Ver quién tiene mensajes sin leer

```sql
SELECT * FROM v_unread_threads;
```

### Ver resumen de un cliente

```sql
SELECT * FROM v_client_summary WHERE client_email = 'martina@gmail.com';
```

---

## Plan de mantenimiento

### Diario (automático vía PostgreSQL autovacuum)
- `VACUUM` automático en todas las tablas

### Semanal (manual o cron)
```sql
ANALYZE clients;
ANALYZE assignments;
ANALYZE nutrition_threads;
ANALYZE progress_entries;
```

### Mensual (manual)
```sql
-- Reindexar tablas con alta rotación
REINDEX TABLE audit_events;
REINDEX TABLE email_verification_tokens;

-- Limpiar huérfanos
SELECT sp_cleanup_orphan_audits();
SELECT sp_cleanup_orphan_tokens();
```

---

## Migraciones del esquema

| Versión | Descripción | Archivo |
|---------|-------------|---------|
| V1 | Schema inicial (20 tablas, 13 índices) | `V1__init_schema.sql` |
| V2 | Datos seed (coach, 4 clientes, templates, rutinas, dietas) | `V2__seed_data.sql` |
| V3 | Plan contracts + auditoría (tabla nueva, 5 índices) | `V3__plan_contracts_audit.sql` |
| V5 | Email verification tokens (tabla nueva, 1 índice) | `V5__email_verification.sql` |
| V6 | Fix password hashes | `V6__fix_password_hashes.sql` |
| V7 | `sp_delete_client_by_email` (original) | `V7__sp_delete_client.sql` |
| V8 | Rename seed routines | `V8__rename_seed_routines.sql` |
| V9 | `users.client_id → ON DELETE SET NULL` | `V9__fix_users_client_fk_cascade.sql` |
| V10 | Reinsert seed clients + lowercase status | `V10__reinsert_seed_clients.sql` |
| V11 | `nutrition_threads.last_read_at` | `V11__thread_last_read_at.sql` |
| V12 | `nutrition_threads.client_last_read_at` | `V12__thread_client_last_read_at.sql` |
| V13 | Cleanup Leandro demo data | `V13__cleanup_leandro_demo.sql` |
| V14 | SPs mejorados + views + índices + cleanup huérfanos | `V14__dba_optimizations.sql` |

---

## Performance notes

### Consultas optimizadas en V14

Antes de V14, las siguientes operaciones hacían **full table scan**:

| Operación | Tabla | Fix |
|-----------|-------|-----|
| `getMyRoutine()` | `assignments` | `findByClientIdAndActive()` usa índice `idx_assignments_client_active` |
| `getMyDiet()` | `diet_assignments` | `findByClientIdAndActive()` usa índice `idx_diet_assignments_client_active` |
| `createAssignment()` | `assignments` | `findByClientIdAndActive()` usa índice |
| `assignDiet()` | `diet_assignments` | `findByClientIdAndActive()` usa índice |
| `getNotifications()` | `diet_assignments` | `findByActive()` usa índice `idx_diet_assignments_client_active` |
| `getAssignmentsForClient()` | `assignments` | `findByClientId()` usa `idx_assignments_client_active` |

**N+1 eliminado:** `getNotifications()` ya no hace `findById(dietId)` por cada diet assignment activa — usa `findByActive(true)` con una sola query.
