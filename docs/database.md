# Database - AV Fitness App

Actualizado: 2026-06-17

## Conexion

```bash
# Via Docker (interactivo):
db-docker.bat

# O via Node.js (una query):
node db.js "SELECT ..."
```

Requiere Docker o Node.js con modulo `pg` instalado.

## Queries utiles

### Eliminar un cliente con todo su rastro (stored procedure)

```sql
SELECT sp_delete_client_by_email('test@email.com');
```

Devuelve un resumen de lo eliminado: contracts, payments, onboardings, tokens, notes, threads.

El SP esta definido en `V7__sp_delete_client.sql` y se aplica automaticamente via Flyway.

Las tablas `assignments`, `notes`, `progress_entries`, `diet_assignments` y `nutrition_threads` se limpian automaticamente por `ON DELETE CASCADE` desde `clients`.

### Listar usuarios registrados via plan-contracts

```sql
SELECT c.name, c.email, c.join_date, pc.status
FROM clients c
JOIN plan_contracts pc ON pc.client_id = c.id
ORDER BY c.join_date DESC;
```

### Verificar migraciones aplicadas

```sql
SELECT version, description, installed_on, success
FROM flyway_schema_history
ORDER BY installed_rank;
```
