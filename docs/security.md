# Security Architecture & Zero-Trust Quality Gates

## Current Security Model (Frontend-Only)

The AV Fitness App currently has **no real security layer** — it operates entirely on the client with localStorage.

| Aspect | Current State | Risk |
|--------|--------------|------|
| Authentication | Client-side only (MOCK_USERS + registered users in localStorage) | Usernames/passwords stored in browser localStorage |
| Authorization | Route guards (CoachRoute, ClientRoute) | Bypassable via localStorage manipulation |
| Data storage | All data in localStorage | Accessible via DevTools |
| Email verification | Mock code "123456" | No real verification |
| Payment | Mock simulation | No real transactions |
| Tokens | None | Sessions are plain objects in localStorage |

**Current A11y Status:**
- All onboarding form fields have `aria-required`, `aria-invalid`, `aria-describedby`, `htmlFor`
- Radio/toggle groups use `role="radiogroup"` with `aria-checked`
- Steps track uses `role="progressbar"` with `aria-valuenow/min/max` and `aria-current="step"`
- Error messages have `role="alert"`
- Focus management: `window.scrollTo(0, 0)` on step change
- Icon SVGs have `aria-hidden="true"`

## Planned Security Architecture (Production)

### Gate: application-security-zero-trust
**Severity:** blocking

#### Static Analysis (SAST)
- `blocker_vulnerabilities_allowed`: 0
- `critical_vulnerabilities_allowed`: 0
- `high_vulnerabilities_allowed`: 0
- `medium_vulnerabilities_allowed`: 0

#### Dependency Analysis (SCA)
- `known_exploited_vulnerabilities_allowed`: 0
- `critical_cves_allowed`: 0
- `high_cves_allowed`: 0
- `outdated_direct_dependencies_allowed`: 0
- `dependency_lockfile_required`: true
- `dependency_confusion_protection_required`: true

#### Secrets Management
- `secret_scanning_required`: true
- `exposed_secrets_allowed`: 0

**Forbidden:**
- Hardcoded passwords, tokens, private keys
- Cloud credentials (AWS/GCP/Azure keys)
- Database credentials in source code
- Secrets in frontend bundles
- Secrets in logs
- Secrets in git history

**Implementation:** Use Railway environment variables for all secrets. GitHub secrets for CI/CD tokens.

#### Authentication (Production)
- Authentication required by default (no unauthenticated access to API)
- Secure password hashing: BCrypt (cost factor ≥ 12)
- Brute force protection: rate limiting on login endpoint
- Session expiration: JWT with short-lived access tokens (15 min)
- Refresh token rotation: one-time-use refresh tokens
- Token revocation: server-side blacklist for revoked tokens

**Forbidden:**
- Credentials in URLs
- Tokens in localStorage (use httpOnly cookies instead)
- Predictable session identifiers (UUIDs only)
- Indefinite sessions (max 7 days)

#### Authorization
- Deny by default: all endpoints require explicit `@PreAuthorize`
- Server-side authorization: roles checked on every request
- Object-level authorization: clients can only access their own data
- Function-level authorization: coach-only operations protected
- Tenant isolation: coaches can only see their own clients

**Required Authorization Tests:**
- Horizontal privilege escalation: client A cannot access client B's data
- Vertical privilege escalation: client cannot access coach endpoints
- Insecure direct object reference (IDOR): cannot access by guessing IDs
- Cross-tenant access: coach A cannot see coach B's clients
- Unauthorized admin operation

#### Input & Output
- Input validation on ALL endpoints (server-side, not just client)
- Output encoding (prevent XSS in responses)
- Parameterized queries (JPA Criteria API or named parameters)
- File upload validation (if added): type, size, virus scanning

**Forbidden:**
- String concatenated SQL
- Dynamic code execution (eval, Function constructor)
- Unsafe deserialization
- Unrestricted file upload
- Unvalidated redirects
- User-controlled path traversal

#### Web Security Headers (Production)
| Header | Value |
|--------|-------|
| Content-Security-Policy | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:` |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=()` |

#### Cookie Security (Production)
- `Secure`: true (HTTPS only)
- `HttpOnly`: true (not accessible to JavaScript)
- `SameSite`: `Strict` or `Lax`
- `Path`: `/api`

#### CORS (Production)
- `strict_cors_required`: true
- Origin allowlist only (no wildcard with credentials)
- No reflected origin without allowlist

**Forbidden CORS:**
- `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true`
- Reflected origin header without allowlist validation

#### API Security
- Rate limiting on all endpoints (token bucket, e.g., 100 req/min per IP)
- Request size limit (e.g., 10MB for JSON body)
- Response data minimization (no internal IDs, stack traces, or debug info)
- Mass assignment protection (use DTOs, not entities, as request bodies)
- Schema validation (validate all inputs against expected schema)
- Idempotency for critical writes (prevent duplicate payments)

**Forbidden in API Responses:**
- Stack traces
- Internal identifiers without need (use public UUIDs, not sequential IDs)
- Unrestricted API documentation in production (if Swagger, require auth)
- Sensitive data in error messages

#### Infrastructure Security
- Container runs as non-root user
- Read-only filesystem for application container
- Privileged containers: 0 allowed
- Critical container vulnerabilities: 0 allowed
- Public services require explicit approval
- Least privilege IAM (Railway service tokens scoped to minimum permissions)
- Encryption at rest (Railway volumes, PostgreSQL encryption)
- Encryption in transit (TLS 1.3, HTTPS enforced)

#### Dynamic Testing (DAST)
**Required Attack Tests:**
- SQL Injection
- Cross-Site Scripting (XSS)
- CSRF (Cross-Site Request Forgery)
- SSRF (Server-Side Request Forgery)
- Path Traversal
- Command Injection
- Insecure Deserialization
- Broken Access Control
- Rate Limit Bypass
- Authentication Bypass

#### Supply Chain Security
- SBOM (Software Bill of Materials) required
- Artifact signing required (container image signing)
- Provenance required (SLSA Level 2+)
- Immutable artifacts (tags are immutable, use digests)
- Protected branches (main requires PR + review)
- Mandatory code reviewers: 2

## Focus Areas for Migration

### 1. Remove localStorage-based auth
Replace with JWT-based authentication via Spring Security. Frontend stores tokens in memory or httpOnly cookies.

### 2. Real email verification
Replace mock "123456" code with Resend/SendGrid integration. Generate random 6-digit codes, store in DB with expiry (10 minutes).

### 3. Real payment integration
Replace PaymentSimulator with MercadoPago Checkout Pro API integration. Create preferences via backend, handle webhooks, store payment records.

### 4. Reference IDs over sequential IDs
Use UUIDs for all entity IDs (already partially done with `uid()` function in AppContext). Ensure no sequential/incremental IDs leak in URLs or API responses.

### 5. Environment-based configuration
All credentials, API keys, and database URLs must come from environment variables, never from source code.
