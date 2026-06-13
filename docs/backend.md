# Backend Architecture & Quality Gates

## Current State

The AV Fitness App currently operates **entirely on the frontend** with `localStorage` as the persistence layer. There is no backend server, no database, and no API.

The goal is to migrate to a production backend connected to Railway via GitHub.

## Planned Architecture: Hexagonal (Ports & Adapters)

```
┌──────────────────────────────────────────────────────────────┐
│                     DOMAIN (Core)                             │
│  Entities: Client, Coach, Routine, Exercise, Diet, Meal,     │
│            Note, Progress, Assignment, Plan, Payment          │
│  Value Objects: Email, Phone, Goal, FitnessLevel, Weight      │
│  Use Cases: RegisterClient, AssignRoutine, LogProgress,       │
│             ProcessPayment, ChatWithCoach, PlanDiet           │
├──────────────────────────────────────────────────────────────┤
│                     PORTS (Interfaces)                        │
│  ClientRepository, RoutineRepository, DietRepository          │
│  PaymentGateway, EmailService, AIService, AuthService         │
├──────────────────────────────────────────────────────────────┤
│                     ADAPTERS (Infrastructure)                 │
│  REST Controllers, PostgreSQL Repository, JPA Entities        │
│  MercadoPago Adapter, Resend/SendGrid Adapter,                │
│  OpenAI/Claude Adapter, JWT Auth Filter                       │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack (Proposed)

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Runtime | Java 21 / Kotlin | Type safety, JVM ecosystem, Spring Boot maturity |
| Framework | Spring Boot 3.x | REST controllers, dependency injection, security |
| Database | PostgreSQL 16 | Relational data, JSONB for flexible schemas, Railway native support |
| ORM | Spring Data JPA + Hibernate | Repository pattern, migration support (Flyway) |
| Auth | Spring Security + JWT | Stateless auth, token rotation, refresh tokens |
| Payment | MercadoPago Checkout Pro API | Native LATAM payment gateway |
| Email | Resend / SendGrid | Transactional email, verification codes |
| AI | OpenAI / Claude API | Nutritional assistant chatbot |
| Testing | JUnit 5, Mockito, TestContainers, ArchUnit | Unit, integration, architecture tests |
| CI/CD | GitHub Actions → Railway | Automated deploy from main branch |

## Database Schema (Proposed)

```sql
-- Core entities
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  goal VARCHAR(500),
  status VARCHAR(20),  -- activo, pausado, inactivo
  join_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE coaches (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE routines (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  goal VARCHAR(255),
  template_id UUID REFERENCES routine_templates(id),
  exercises JSONB,  -- [{name, sets, reps, rest, notes, videoUrl}]
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assignments (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  routine_id UUID REFERENCES routines(id),
  diet_id UUID REFERENCES diets(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

CREATE TABLE nutrition_threads (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  messages JSONB  -- [{sender, text, date}]
);

CREATE TABLE ai_threads (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  messages JSONB  -- Separate from human Q&A
);

CREATE TABLE onboarding_submissions (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  plan_id VARCHAR(20),
  form_data JSONB,  -- All questionnaire responses
  submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  plan_id VARCHAR(20),
  preference_id VARCHAR(100),  -- MercadoPago preference ID
  status VARCHAR(20),          -- pending, approved, rejected
  amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints (Proposed)

### Public
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Client registration |
| POST | `/api/auth/login` | Login (returns JWT) |
| POST | `/api/auth/refresh` | Refresh token rotation |
| POST | `/api/auth/verify-email` | Email verification |
| POST | `/api/onboarding` | Submit onboarding questionnaire |
| GET | `/api/plans` | List available plans |

### Payment
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/payment/create-preference` | Create MercadoPago preference |
| POST | `/api/payment/webhook` | MercadoPago webhook receiver |
| GET | `/api/payment/status/:preferenceId` | Check payment status |

### Coach (Auth Required: ROLE_COACH)
| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/clients` | List / Create clients |
| GET/PUT/DELETE | `/api/clients/:id` | Get / Update / Delete client |
| GET/POST | `/api/templates` | List / Create workout templates |
| GET/PUT/DELETE | `/api/templates/:id` | Get / Update / Delete template |
| GET/POST | `/api/routines` | List / Create routines |
| POST | `/api/routines/from-template` | Create routine from template |
| POST | `/api/assignments` | Assign routine to client |
| GET/POST | `/api/notes` | List / Create notes |
| GET/POST | `/api/diet-templates` | List / Create diet templates |
| POST | `/api/diets/from-template` | Create diet from template |
| POST | `/api/threads/:clientId/messages` | Send message in nutrition thread |

### Client (Auth Required: ROLE_CLIENT)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/me/routine` | Get assigned routine |
| GET | `/api/me/diet` | Get assigned diet |
| GET | `/api/me/progress` | Get weight history |
| POST | `/api/me/progress` | Log weight entry |
| DELETE | `/api/me/progress/:id` | Delete weight entry |
| GET/POST | `/api/me/thread` | Nutrition Q&A with coach |
| GET/POST | `/api/me/ai-chat` | AI assistant chat (proxied to LLM) |
| GET | `/api/me/notes` | Get coach observations |

## Backend Quality Gates

### Gate: backend-architecture-and-testing
**Severity:** blocking

#### Compilation
- `build_success`: true
- `warnings_allowed`: 0
- `dependency_resolution_errors`: 0

#### Architecture (Hexagonal)
**Forbidden Dependencies:**
- `domain → infrastructure`
- `domain → framework`
- `application → controller`
- `application → repository_implementation`

**Rules:**
- Controllers must not contain business logic
- Repositories must not expose framework entities (JPA entities mapped to domain)
- Domain must not import Spring/JPA annotations
- Use cases must be framework-agnostic
- External integrations must use ports and adapters

**Architecture Tests:**
- Required: true
- Framework: ArchUnit
- Passing percentage: 100%

#### Tests
| Metric | Minimum |
|--------|---------|
| Global line coverage | 90% |
| Global branch coverage | 85% |
| Critical domain line coverage | 100% |
| Critical domain branch coverage | 95% |
| Critical domain mutation score | 85% |

**Required Test Types:**
- Unit tests
- Integration tests (repository + service)
- Repository tests (TestContainers PostgreSQL)
- Controller contract tests
- Architecture tests (ArchUnit)

**Forbidden:**
- Ignored/skipped tests (`@Disabled`, `@Ignore`)
- Tests without assertions
- Tests only verifying HTTP status codes
- Mocks of domain objects without justification

#### Complexity
| Metric | Maximum |
|--------|---------|
| Cyclomatic complexity per method | 8 |
| Cognitive complexity per method | 10 |
| Method lines | 30 |
| Class lines | 300 |
| Method parameters | 5 |
| Nesting depth | 3 |

#### Maintainability
- Duplicated lines maximum: 2%
- Code smells allowed: 0
- Blocker issues allowed: 0
- Critical issues allowed: 0
- Major issues allowed: 0
- Technical debt ratio maximum: 2%

### Gate: backend-performance-and-resilience
**Severity:** blocking

#### Performance
| Metric | Maximum |
|--------|---------|
| Read endpoint p95 | 200ms |
| Read endpoint p99 | 400ms |
| Write endpoint p95 | 350ms |
| Write endpoint p99 | 700ms |
| Minimum requests/second | 500 |
| Error rate maximum | 0.1% |
| Max latency regression | 5% |
| Max throughput regression | 3% |

#### Database
- N+1 queries allowed: 0
- Unbounded queries allowed: 0
- Queries without timeout: 0
- Transactions without defined boundary: 0
- Maximum queries per standard request: 5
- Required pagination for collections: true
- Required indexes for frequent filters: true
- Full table scan allowed: false
- Sequential scan allowed: false
- Estimated execution time maximum: 100ms

#### Resilience
- All external calls must have timeouts (connection + read)
- Retry only for idempotent operations (max 3 attempts)
- Required patterns: circuit breaker, bulkhead, graceful degradation
- Forbidden: infinite retries, catch-and-ignore, generic exception swallowing, blocking IO in reactive flows, network calls inside DB transactions

#### Observability
- Structured logs required
- Correlation ID required
- Distributed tracing required
- Health checks required (`/actuator/health`)
- Required metrics: request duration, request count, error rate, DB pool usage, external dependency latency, circuit breaker state, retry count
- Forbidden in logs: passwords, tokens, auth headers, PII

## Railway Deployment

See `docs/pipeline.md` for complete CI/CD deployment flow on Railway + GitHub.
