# AV Fitness App — Architecture & Project Context

## Project Overview

**AV Fitness App** is a Platform-as-a-Service (PaaS) mockup for personal trainer **Adrián Vila**. It is a React + Vite single-page application built as a fully-functional frontend prototype, with localStorage as the persistence layer (no backend yet).

- **Stack:** React 19 + Vite 8 + react-router-dom v7 (HashRouter) + Recharts v3
- **Language:** Spanish (es-AR)
- **Base URL:** `/av/` (configured in `vite.config.js`)
- **Styling:** Vanilla CSS with CSS custom properties, dark theme "Glassmorphism", green fluorescent accent (`rgb(0,255,0)`)
- **Fonts:** Outfit (headings) + Inter (body), loaded from Google Fonts

## File Structure

```
av/
├── index.html                          # HTML entry (lang=es, base=/av/)
├── vite.config.js                      # Vite config (base: '/av/', plugin: react)
├── package.json                        # Dependencies: react 19, vite 8, react-router-dom 7, recharts 3, lucide-react
├── eslint.config.js                    # ESLint flat config: js, react-hooks, react-refresh
├── README.md                           # Original project readme
├── docs/                               # Context files for AI agents (this directory)
│   ├── architecture.md                 # THIS FILE
│   ├── frontend.md                     # Frontend architecture + quality gates
│   ├── backend.md                      # Planned backend architecture (hexagonal)
│   ├── security.md                     # Zero-trust security gates
│   ├── pipeline.md                     # Railway + GitHub CI/CD deployment
│   └── dod.md                          # Definition of Done + quality gates summary
├── public/
├── src/
│   ├── main.jsx                        # React root mount (imports global.css)
│   ├── App.jsx                         # Route definitions, guards (CoachRoute, ClientRoute, AuthRedirect)
│   ├── App.css                         # UNUSED — legacy scaffold file
│   ├── index.css                       # UNUSED — legacy scaffold file
│   ├── assets/                         # hero.png, react.svg, vite.svg
│   ├── context/
│   │   ├── AuthContext.jsx             # Auth state: login/logout/registerUser/demo, localStorage
│   │   └── AppContext.jsx              # ALL app data: 12+ collections, localStorage CRUD, toast
│   ├── data/
│   │   └── seed.js                     # All mock data: users, clients, templates, routines, diets, products, plans, notes
│   ├── pages/
│   │   ├── Landing.jsx                 # Public marketing landing (hero, services, plans, about, testimonials, CTA)
│   │   ├── Login.jsx                   # Demo + form login (2 tabs)
│   │   ├── Onboarding.jsx              # 6-step onboarding form (orchestrator only)
│   │   ├── PaymentSimulator.jsx        # MercadoPago checkout simulation
│   │   ├── coach/                      # Coach pages (7 routes)
│   │   │   ├── CoachDashboard.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── ClientDetail.jsx
│   │   │   ├── Templates.jsx
│   │   │   ├── DietTemplates.jsx
│   │   │   ├── Routines.jsx
│   │   │   ├── Assign.jsx
│   │   │   └── Notes.jsx
│   │   ├── client/                     # Client pages (7 routes)
│   │   │   ├── ClientDashboard.jsx
│   │   │   ├── ClientRoutine.jsx
│   │   │   ├── ClientProgress.jsx
│   │   │   ├── ClientGoals.jsx
│   │   │   ├── ClientNutrition.jsx
│   │   │   ├── ClientAIAssistant.jsx
│   │   │   └── ClientNotes.jsx
│   │   └── store/                      # Public store pages (3 routes)
│   │       ├── Store.jsx
│   │       ├── ProductDetail.jsx
│   │       └── Cart.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── CoachLayout.jsx         # Sidebar + topbar + content shell for coach
│   │   │   └── ClientLayout.jsx        # Top nav + bottom tab bar + content for client
│   │   ├── ui/
│   │   │   └── Modals.jsx              # Toast, Modal, ConfirmModal
│   │   └── onboarding/                 # Multi-step form components (7 files)
│   │       ├── StepIcons.jsx           # SVG icon components (User, Activity, Health, Mind, Eye, Lock, Check)
│   │       ├── StepsTrack.jsx          # Step progress bar with dots + lines
│   │       ├── FormPrimitives.jsx      # FieldError, FormGroup, RadioGroup, ToggleGroup
│   │       ├── Step1Personal.jsx       # Name, email, whatsapp, age, height, weight, sex
│   │       ├── Step2Habits.jsx         # Activity type, daily steps, sleep hours
│   │       ├── Step3Health.jsx         # Pathology, medical clearance, fitness level, frequency
│   │       ├── Step4Profile.jsx        # Body image, purpose, complexes, injuries, city
│   │       ├── Step5Summary.jsx        # Review all data before account creation
│   │       └── Step5Account.jsx        # Email verification code + password + terms
│   └── styles/
│       └── global.css                  # 1403 lines: design tokens, reset, components, layouts, responsive
```

## Routing

Uses `HashRouter` (for static hosting compatibility with base `/av/`).

### Public Routes (no auth)
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Landing` | Marketing landing page |
| `/login` | `Login` | Demo + form login |
| `/store` | `Store` | Product catalog |
| `/store/:id` | `ProductDetail` | Individual product |
| `/store/cart` | `Cart` | Shopping cart |
| `/pago` | `PaymentSimulator` | MercadoPago checkout mock |
| `/onboarding` | `Onboarding` | 6-step client onboarding form |

### Coach Routes (requires auth + role === 'coach')
| Route | Component | Description |
|-------|-----------|-------------|
| `/coach` | `CoachDashboard` | Stats, recent clients, notes, quick actions |
| `/coach/clients` | `Clients` | Client CRUD |
| `/coach/clients/:id` | `ClientDetail` | 5-tab client detail view |
| `/coach/templates` | `Templates` | Workout template CRUD |
| `/coach/diet-templates` | `DietTemplates` | Diet plan template CRUD |
| `/coach/routines` | `Routines` | Routine CRUD + template-based creation |
| `/coach/assign` | `Assign` | Assign routines to clients |
| `/coach/notes` | `Notes` | Per-client observations CRUD |

### Client Routes (requires auth + role === 'client')
| Route | Component | Description |
|-------|-----------|-------------|
| `/client` | `ClientDashboard` | Home with summary cards |
| `/client/routine` | `ClientRoutine` | Assigned workout accordion viewer |
| `/client/progress` | `ClientProgress` | Weight chart + history |
| `/client/goals` | `ClientGoals` | Goal overview + milestones |
| `/client/nutrition` | `ClientNutrition` | Diet plan + Q&A chat |
| `/client/ai-assistant` | `ClientAIAssistant` | AI nutrition chatbot |
| `/client/notes` | `ClientNotes` | Read-only coach observations |

## Data Architecture

### Context Providers (wrapping order)
```
AuthProvider > AppProvider > HashRouter
```

### AuthContext
- `user` — current logged-in user (persisted in localStorage key `av_user`)
- `login(email, password)` — finds user in MOCK_USERS + registered users
- `loginAsDemo(role, clientId?)` — quick demo login
- `registerUser(name, email, password)` — creates new user, persists to `av_registered_users`
- `logout()` — clears user state and localStorage

### AppContext (all domain data)
12 collections, each persisted to its own localStorage key:

| Collection | localStorage Key | Seed Source |
|-----------|-----------------|-------------|
| `clients` | `av_clients` | `SEED_CLIENTS` |
| `templates` | `av_templates` | `SEED_TEMPLATES` |
| `routines` | `av_routines` | `SEED_ROUTINES` |
| `assignments` | `av_assignments` | `SEED_ASSIGNMENTS` |
| `notes` | `av_notes` | `SEED_NOTES` |
| `progress` | `av_progress` | `SEED_PROGRESS` |
| `products` | `av_products` | `SEED_PRODUCTS` (read-only) |
| `cart` | `av_cart` | `[]` |
| `dietTemplates` | `av_diet_templates` | `SEED_DIET_TEMPLATES` |
| `diets` | `av_diets` | `SEED_DIETS` |
| `dietAssignments` | `av_diet_assignments` | `SEED_DIET_ASSIGNMENTS` |
| `nutritionThreads` | `av_nutrition_threads` | `SEED_NUTRITION_THREADS` |
| `onboardingSubmissions` | `av_onboarding` | `[]` |

Each collection has corresponding CRUD functions (e.g., `addClient`, `updateClient`, `deleteClient`, `getClient`).

## Code Conventions

- **Exports:** Default exports for pages, named exports for shared utilities
- **Styling:** Prefer CSS class names from `global.css` over inline styles. Inline styles only for dynamic values.
- **Comments:** Use `// ── Section ──` block comments (em-dash separators)
- **File naming:** PascalCase for components, camelCase for utilities
- **No external icon libraries** — SVG icons defined inline as local functions
- **Language:** All UI text in Spanish (es-AR)
- **UID generation:** `Date.now().toString(36) + Math.random().toString(36).slice(2)`

## Quality Gates

See `docs/frontend.md`, `docs/backend.md`, `docs/security.md`, and `docs/dod.md` for complete quality gate specifications.

## Dependency Graph (simplified)

```
main.jsx
  └── App.jsx
        ├── AuthProvider
        │     └── AuthContext (MOCK_USERS from seed.js)
        ├── AppProvider
        │     └── AppContext (all seed data from seed.js)
        └── HashRouter
              ├── Landing (public)
              │     └── SEED_PLANS (from seed.js)
              ├── Login (public)
              ├── PaymentSimulator (public)
              ├── Onboarding (public)
              │     └── onboarding/ components (7 files)
              ├── CoachLayout (coach routes)
              │     └── CoachDashboard, Clients, ClientDetail, etc.
              ├── ClientLayout (client routes)
              │     └── ClientDashboard, ClientRoutine, etc.
              └── Store pages (public, no layout wrapper)
```
