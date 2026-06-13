# Definition of Done (DoD) & Quality Gates Summary

## Core Rule

**No implementation is considered complete because it compiles or because the main flow works.**

All applicable quality gates must pass at 100% before declaring a task finished.

## Prohibited Practices

The following are **strictly prohibited** at all times:

| Category | Forbidden Action |
|----------|-----------------|
| **Thresholds** | Reducing coverage, performance, or security thresholds |
| **Linter** | Disabling ESLint rules, Sonar rules, or analysis rules |
| **Security** | Disabling SAST, DAST, or dependency analysis |
| **Tests** | Adding exclusions to artificially pass the pipeline |
| **Tests** | Marking tests as `skipped`, `@Disabled`, `@Ignore`, or `disabled` |
| **Tests** | Replacing real verifications with excessive mocks |
| **Errors** | Silencing errors via generic catch blocks (`catch (Exception e) {}`) |
| **Code** | Delivering code with TODO, FIXME, stub, or temporary implementations |
| **Evidence** | Declaring success without providing verifiable evidence |

## Compliance Protocol

When a quality gate fails:

1. **Identify root cause** — don't guess, use tool output to find the exact violation
2. **Fix the implementation** — not the test, not the threshold, the actual code
3. **Re-run ALL affected validations** — not just the one that failed
4. **Report metrics before and after** — show what was and what is now
5. **Do not declare done** until 100% of gates pass

## Exception Policy

Exceptions are **only valid** when ALL of the following conditions are met:

- [ ] Documented in writing (in the PR or ticket)
- [ ] Has a named responsible person (not the AI agent)
- [ ] Has a technical justification (why this can't be fixed now)
- [ ] Has a documented risk assessment
- [ ] Has a mitigation plan
- [ ] Has an expiration date

**The AI agent cannot self-approve exceptions.** Exceptions must come from a human reviewer.

---

## Quality Gates Quick Reference

### Frontend Gates (`docs/frontend.md`)
| Gate | Command | Pass Criteria |
|------|---------|--------------|
| Build | `npm run build` | Success |
| Lint | `npm run lint` | 0 errors, 0 warnings |
| ESLint rules | — | All active, none suppressed |
| Component lines | Manual review | ≤ 200 lines |
| Cognitive complexity | Manual review | ≤ 10 |
| No `useEffect` for calculations | ESLint `react-hooks` | 0 violations |
| No unstable keys | ESLint | 0 violations |

### Backend Gates (`docs/backend.md`)
| Gate | Command | Pass Criteria |
|------|---------|--------------|
| Build | `./gradlew build` | Success, 0 warnings |
| Unit tests | `./gradlew test` | 90% line, 85% branch |
| Architecture tests | `./gradlew test` | 100% ArchUnit passing |
| Integration tests | `./gradlew integrationTest` | 90% line coverage |
| Complexity limits | Sonar/ArchUnit | Per-method max 8 CC, 10 cognitive |

### Security Gates (`docs/security.md`)
| Gate | Tool | Pass Criteria |
|------|------|--------------|
| SAST | CodeQL | 0 blocker/critical/high/medium |
| SCA | `npm audit`, Gradle dependency check | 0 critical/high CVEs |
| Secrets | Gitleaks | 0 exposed secrets |
| No hardcoded credentials | Manual + SAST | 0 findings |
| Secure headers | Spring Security config | All required headers present |
| CSRF protection | Spring Security config | Enabled |
| Rate limiting | API Gateway / Spring | Configured on all endpoints |

### Pipeline Gates (`docs/pipeline.md`)
| Gate | Check | Pass Criteria |
|------|-------|--------------|
| Protected branches | GitHub settings | `main` requires PR + 2 reviews |
| CI on PR | GitHub Actions | All jobs pass |
| Deploy on merge | GitHub Actions | Railway deploy success |
| Health check | Railway | `/actuator/health` returns 200 |
| Rollback plan | Railway | Last 5 deploys available |

---

## Current Project Status

### Frontend (This Check)
```
✅ Build:       PASS (vite build)
✅ Lint:        PASS (0 errors, 0 warnings)
⬜ Tests:       NOT CONFIGURED (no test framework added yet)
⬜ E2E:         NOT CONFIGURED
⬜ Visual Reg:  NOT CONFIGURED
```

### Backend
```
⬜ Build:       NOT STARTED (no backend yet)
⬜ Tests:       NOT STARTED
⬜ Security:    NOT STARTED
```

### Deployment
```
⬜ Railway:     NOT CONFIGURED (coming with backend migration)
⬜ CI/CD:       NOT CONFIGURED
```

## Verification Commands

```bash
# Frontend
cd C:\Users\Leandro\Documents\projects\av
npm run lint        # ESLint: 0 errors required
npm run build       # Vite build: success required

# Backend (future)
cd backend
./gradlew check     # Tests + lint
./gradlew build     # Full build
./gradlew test      # Unit tests with coverage
./gradlew integrationTest  # Integration tests

# Railway CLI (future)
railway up           # Deploy
railway logs         # View logs
railway status       # Check health
railway rollback     # Rollback if needed
```

## Checklist for Every PR

Before marking any PR as ready for review:

- [ ] `npm run lint` passes with 0 errors and 0 warnings
- [ ] `npm run build` succeeds
- [ ] No hardcoded secrets, tokens, or passwords
- [ ] New code follows existing naming and folder conventions
- [ ] Components ≤ 200 lines (split if larger)
- [ ] No dead code, unused exports, or commented-out blocks
- [ ] All form inputs have labels and error states
- [ ] Responsive at 380px, 640px, 768px, and 1024px breakpoints
- [ ] If a new feature was added, the relevant context docs are updated
- [ ] No TODO, FIXME, or stub implementations
