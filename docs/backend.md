# Backend - Arquitectura y lineamientos

Actualizado: 2026-06-16

## Stack

| Capa | Tecnologia |
|---|---|
| Runtime | Java 21 |
| Framework | Spring Boot |
| Seguridad | Spring Security + JWT |
| Persistencia | Spring Data JPA |
| DB | PostgreSQL |
| Migraciones | Flyway |
| Docs API | Springdoc OpenAPI / Swagger UI |
| Build | Maven Wrapper |

## Estructura

```text
av-backend/
  src/main/java/com/av/fitness/
    config/
    controller/
    dto/
    model/
    repository/
    service/
  src/main/resources/
    application.yml
    db/migration/
  pom.xml
  mvnw
  mvnw.cmd
```

## Endpoints principales

Publicos:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/plans`
- `POST /api/plan-contracts/start`
- `POST /api/plan-contracts/{contractId}/mock-payment`
- `POST /api/plan-contracts/{contractId}/complete-onboarding`
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/onboarding`
- `POST /api/payment/create-preference`

Contratacion de planes:

- El orden productivo actual es `Plan -> Pago mock -> Formulario -> Usuario`.
- `plan_contracts` registra el proceso completo.
- `payments` registra la preferencia mock MercadoPago desde el inicio, incluso antes de existir `client_id`.
- `onboarding_submissions`, `clients` y `users` se crean al completar el formulario.
- `audit_events` registra eventos clave sin passwords, tokens ni datos de tarjeta.

Coach:

- `/api/coach/clients`
- `/api/coach/templates`
- `/api/coach/routines`
- `/api/coach/assignments`
- `/api/coach/diet-templates`
- `/api/coach/diets`
- `/api/coach/clients/{id}/notes`
- `/api/coach/clients/{id}/thread/message`

Cliente:

- `/api/me/routine`
- `/api/me/diet`
- `/api/me/progress`
- `/api/me/notes`
- `/api/me/thread`
- `/api/me/thread/message`

Operacional:

- `/actuator/health`
- `/v3/api-docs`
- `/swagger-ui/index.html`

## Railway

Configuracion esperada:

```properties
server.port=${PORT:8080}
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
```

Variables requeridas:

- `SPRING_PROFILES_ACTIVE=production`
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`
- `AUTH_COOKIE_SECURE=true`

Servicio Railway productivo:

- Proyecto: `av` (`d4fdeffd-14ee-4284-b3aa-327f328e706d`)
- Servicio: `av-backend`
- URL: `https://av-backend-production.up.railway.app`
- Deploy desde repo: `railway up ./av-backend --path-as-root --project d4fdeffd-14ee-4284-b3aa-327f328e706d --environment production --service av-backend --detach`

## Swagger

Swagger esta habilitado y permitido por seguridad:

- `GET /v3/api-docs`
- `GET /swagger-ui/index.html`

Pendiente de decision: dejar publico en produccion o protegerlo por rol/admin.

## Validacion

```powershell
cd av-backend
.\mvnw.cmd test --batch-mode
.\mvnw.cmd package -DskipTests --batch-mode
docker build -t av-backend-audit .
```

En Linux/GitHub Actions:

```bash
chmod +x ./mvnw
./mvnw --batch-mode test
./mvnw --batch-mode package -DskipTests
```

## Lineamientos

- Controllers sin logica de negocio pesada.
- Services concentran casos de uso.
- Repositories encapsulan acceso JPA.
- DTOs separan contrato API de entidades.
- Flyway es la fuente de schema/seed.
- No loguear tokens, passwords, auth headers ni PII sensible.
- Toda integracion externa debe tener timeout y manejo de error explicito.

## Pendientes backend

- Aumentar cobertura de tests unitarios e integracion.
- Agregar tests de seguridad por rol para `/api/coach/*` y `/api/me/*`.
- Completar integraciones reales MercadoPago, Resend y OpenAI.
- Definir politica productiva para Swagger.
