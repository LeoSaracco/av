# Database - AV Fitness App

Actualizado: 2026-06-16

## Conexion

```bash
railway connect postgres
```

Requiere `psql` instalado localmente.

## Queries utiles

### Eliminar un usuario/cliente con todo su rastro

```sql
DO $$
DECLARE
    target_email TEXT := 'leosaracco@gmail.com';
    target_client_id UUID;
    target_user_id UUID;
BEGIN
    SELECT id INTO target_client_id FROM clients WHERE email = target_email;
    SELECT id INTO target_user_id FROM users WHERE email = target_email;

    DELETE FROM plan_contracts WHERE email = target_email;
    DELETE FROM payments WHERE client_id = target_client_id;
    DELETE FROM onboarding_submissions WHERE client_id = target_client_id;
    DELETE FROM refresh_tokens WHERE user_id = target_user_id;
    DELETE FROM users WHERE email = target_email;
    DELETE FROM clients WHERE email = target_email;
END $$;
```

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
