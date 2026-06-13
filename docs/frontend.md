# Frontend Architecture & Quality Gates

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | ^19.2.4 |
| Build | Vite | ^8.0.1 |
| Routing | react-router-dom (HashRouter) | ^7.14.0 |
| Charts | Recharts | ^3.8.1 |
| Icons | lucide-react (installed, unused in components) | ^1.7.0 |
| Dev | ESLint 9 flat config + eslint-plugin-react-hooks + eslint-plugin-react-refresh | — |

## Architecture Layers

```
┌──────────────────────────────────────────────────┐
│  Presentation Layer                               │
│  src/pages/  +  src/components/layout/           │
│  (Route components, layout wrappers)              │
├──────────────────────────────────────────────────┤
│  Application Layer                                │
│  src/context/AppContext.jsx + AuthContext.jsx     │
│  (State management, business operations, CRUD)   │
├──────────────────────────────────────────────────┤
│  Domain Layer                                     │
│  src/data/seed.js                                 │
│  (Data structures, entities, seed data)           │
├──────────────────────────────────────────────────┤
│  Infrastructure Layer                             │
│  localStorage (current) → REST API (planned)      │
│  (Data persistence)                               │
└──────────────────────────────────────────────────┘
```

## Component Inventory

### Layout Components
| Component | File | Purpose |
|-----------|------|---------|
| `CoachLayout` | `src/components/layout/CoachLayout.jsx` | Sidebar + content shell for coach pages |
| `ClientLayout` | `src/components/layout/ClientLayout.jsx` | Top nav + bottom tab bar + content for client pages |

### UI Components
| Component | File | Purpose |
|-----------|------|---------|
| `Toast` | `src/components/ui/Modals.jsx` | Auto-dismissing notification |
| `Modal` | `src/components/ui/Modals.jsx` | Generic modal dialog |
| `ConfirmModal` | `src/components/ui/Modals.jsx` | Delete confirmation modal |

### Onboarding Components (7 files)
| Component | File | Purpose |
|-----------|------|---------|
| `StepIcons` | `src/components/onboarding/StepIcons.jsx` | SVG icon primitives (User, Activity, Health, Mind, Eye, Lock, Check) |
| `StepsTrack` | `src/components/onboarding/StepsTrack.jsx` | Step progress bar with dots + connector lines |
| `FieldError` | `src/components/onboarding/FormPrimitives.jsx` | Inline error message with role="alert" |
| `FormGroup` | `src/components/onboarding/FormPrimitives.jsx` | Label + input + error container |
| `RadioGroup` | `src/components/onboarding/FormPrimitives.jsx` | Accessible radio button group |
| `ToggleGroup` | `src/components/onboarding/FormPrimitives.jsx` | Accessible toggle button group |
| `Step1Personal` | `src/components/onboarding/Step1Personal.jsx` | Name, email, whatsapp, age, height, weight, sex |
| `Step2Habits` | `src/components/onboarding/Step2Habits.jsx` | Activity type, daily steps, sleep hours |
| `Step3Health` | `src/components/onboarding/Step3Health.jsx` | Pathology, medical clearance, fitness level, frequency |
| `Step4Profile` | `src/components/onboarding/Step4Profile.jsx` | Body image, purpose, complexes, injuries, city |
| `Step5Summary` | `src/components/onboarding/Step5Summary.jsx` | Data review with per-section edit buttons |
| `Step5Account` | `src/components/onboarding/Step5Account.jsx` | Email verification code + password + terms |

### Page Components (21 files)
See `docs/architecture.md` for full route listing.

## Styling System

### Design Tokens (`global.css :root`)
```css
--color-bg: #000000
--color-bg-2: #0a0a0a
--color-surface: #141414
--color-accent: rgb(0, 255, 0)
--color-accent-dim: rgba(0, 255, 0, 0.15)
--color-text: #f0f0f0
--color-text-2: #a0a0a0
--font-main: 'Outfit', sans-serif
--font-body: 'Inter', sans-serif
```

### Class Naming Convention
- `component-name` for blocks (`.card`, `.btn`, `.form-group`)
- `component-name--modifier` for variants (`.btn-primary`, `.toggle-btn--compact`)
- `component-name-child` for elements (`.step-dot-label`, `.plan-card-price`)

### Responsive Breakpoints
| Breakpoint | Target |
|-----------|--------|
| 1024px | Stats grid 4→2, Grid 3→2 |
| 768px | Sidebar to mobile overlay, Grid 2→1 |
| 640px | Radio cols collapse, hide step labels, form padding |
| 480px | Stats grid compact |
| 380px | Step dots smaller, summary rows stack vertically |
| 700px | Payment checkout grid collapses |
| 400px | Payment card fields (CVV/expiry) stack |

## Frontend Quality Gates

### Gate: frontend-architecture-and-testing
**Severity:** blocking

#### Compilation
- `build_success`: true
- `eslint_errors_allowed`: 0
- `eslint_warnings_allowed`: 0
- Build command: `npm run build`
- Lint command: `npm run lint`

#### Architecture Rules
- Components must not call HTTP clients directly (when backend is added, use context/API layer)
- Business rules must not live in JSX — logic in context/domain, JSX in pages/components
- Shared components must not depend on feature-specific state
- Domain must not depend on React — seed data is plain objects
- API models must be mapped to domain models
- Route components must not become god components — split into sub-components

#### Component Limits
| Metric | Maximum |
|--------|---------|
| Component lines | 200 |
| Hook lines | 100 |
| Cognitive complexity | 10 |
| Props count | 8 |
| Nesting depth | 4 |

#### Forbidden Patterns
- Duplicated business logic
- Side effects during render
- Unstable list keys (no `index` as key)
- Direct DOM manipulation without justification
- Derived state stored unnecessarily (compute from props instead)
- `useEffect` for pure calculations
- Silent promise rejections

#### Required Test Types (when test framework is added)
- Unit tests (components, hooks, utilities)
- Component tests (render + interaction)
- Integration tests (multi-component flows)
- End-to-end tests (critical user journeys)
- Visual regression tests

#### E2E Required Flows
- Authentication (login, logout, demo access)
- Authorization (coach cannot access client routes, vice versa)
- Principal business flow (landing → payment → onboarding → dashboard)
- Form validation (all onboarding steps)
- API error handling (when backend is connected)
- Expired session handling
- Network failure recovery
- Duplicate form submission protection

#### Maintainability
- `duplicated_lines_percentage_maximum`: 2%
- `blocker_issues_allowed`: 0
- `critical_issues_allowed`: 0
- `major_issues_allowed`: 0

### Current Test Status
- No test framework is configured yet
- Quality gate checks are performed via `npm run lint` (ESLint) and `npm run build` (Vite)
- Tests will be added as part of the backend migration

## Existing ESLint Configuration

```js
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
```

## Current Check Results

| Check | Status | Command |
|-------|--------|---------|
| Lint | 0 errors, 0 warnings | `npm run lint` |
| Build | Success | `npm run build` |
| Unit Tests | 26/26 passed (3 suites) | `npm test` |
| react-refresh warnings | Suppressed with eslint-disable in context files | — |
| Unused vars | Cleaned (all pre-existing fixed) | — |
| Husky pre-commit | Configured (lint-staged) | `.husky/pre-commit` |
| EditorConfig | Present | `.editorconfig` |

### Test Coverage (current)

| Suite | Tests | Status |
|-------|-------|--------|
| `FormPrimitives.test.jsx` | 12 | Pass |
| `StepsTrack.test.jsx` | 5 | Pass |
| `AuthContext.test.jsx` | 9 | Pass |
| **Total** | **26** | **26 passed** |

Tested areas: FieldError, FormGroup, RadioGroup (selection + aria), ToggleGroup, StepsTrack (6 pasos, ARIA), registerUser, login, demo access, logout. Not yet tested: pages, layouts, AppContext CRUD, onboarding form flow.
