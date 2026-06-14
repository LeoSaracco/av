# Guía de Deploy — Railway

## Proyecto

- **Nombre:** `av-fitness`
- **Servicios:** `av-frontend` (NIXPACKS), `av-backend` (DOCKERFILE)
- **Base de datos:** PostgreSQL (provisionado por Railway)

## Prerrequisitos

- Cuenta en [Railway](https://railway.com) (plan Hobby o superior)
- GitHub conectado a Railway
- [Railway CLI](https://docs.railway.com/reference/cli) instalado (opcional, para deploy local)
- Repositorio en GitHub con los archivos `railway.toml` configurados

## Arquitectura

```
av-fitness (Railway Project)
├── av-frontend          Static Site, Root Directory: .
│   └── builder: NIXPACKS
├── av-backend           Web Service, Root Directory: backend
│   └── builder: DOCKERFILE
└── av-postgres          Database (PostgreSQL 16)
```

## Paso a paso

### Paso 1: Crear el proyecto en Railway

**Opción A — Desde el dashboard:**
1. Ir a [railway.com](https://railway.com) y hacer clic en **+ New Project**
2. Elegir **Deploy from GitHub repo**
3. Seleccionar el repositorio `LeoSaracco/av`
4. Railway detectará los servicios automáticamente

**Opción B — Desde la CLI (requiere login previo):**
```bash
npm i -g @railway/cli
railway login
railway init
```

### Paso 2: Agregar PostgreSQL

**Desde el dashboard:**
1. Dentro del proyecto, hacer clic en **+ New Service**
2. Elegir **Database → PostgreSQL**
3. Railway provisiona automáticamente la base de datos `av-postgres`

**Desde la CLI:**
```bash
railway add --database postgres
```

Railway inyecta automáticamente la variable `DATABASE_URL` en todos los servicios
del proyecto. No es necesario configurarla manualmente.

### Paso 3: Configurar root directories

En el dashboard de Railway, para cada servicio:

| Servicio | Root Directory |
|----------|---------------|
| `av-frontend` | `.` |
| `av-backend` | `backend` |

Esto se configura en **Servicio → Settings → Root Directory**.

### Paso 4: Configurar variables de entorno

En el dashboard de Railway (**Project → Variables**), agregar las siguientes
variables compartidas o específicas por servicio:

#### Variables del proyecto (compartidas)
| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Auto-provisionada por Railway al agregar PostgreSQL |

#### Variables de `av-backend`
| Variable | Descripción |
|----------|-------------|
| `SPRING_PROFILES_ACTIVE` | `production` |
| `JWT_SECRET` | Clave secreta de 256 bits para JWT (generar con `openssl rand -base64 32`) |
| `MP_ACCESS_TOKEN` | MercadoPago Access Token (producción) |
| `MP_WEBHOOK_SECRET` | MercadoPago Webhook Secret |
| `RESEND_API_KEY` | API Key de Resend para emails transaccionales |
| `OPENAI_API_KEY` | API Key de OpenAI para el chatbot |
| `CORS_ALLOWED_ORIGINS` | `https://av.railway.app` |

#### Variables de `av-frontend`
| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL del backend (Railway genera una URL interna, ej. `https://av-backend.railway.internal`) |
| `VITE_BASE_PATH` | `/av/` |

Las URLs internas de Railway siguen el formato `https://SERVICE_NAME.railway.internal`
y solo funcionan dentro del mismo proyecto. Para exponer el backend externamente,
asignar un dominio público desde **Servicio → Settings → Networking**.

### Paso 5: Crear Project Token

1. Ir al dashboard de Railway → **Project → Settings → Tokens**
2. Hacer clic en **+ New Token**
3. Nombre: `github-actions`
4. Tipo: **Project Token** (no Account Token)
5. Copiar el token generado

Luego, agregarlo a GitHub:
1. Ir al repositorio en GitHub → **Settings → Secrets and variables → Actions**
2. Hacer clic en **New repository secret**
3. Nombre: `RAILWAY_TOKEN`
4. Valor: pegar el token copiado

### Paso 6: Desplegar

El despliegue se dispara automáticamente al hacer push a `main` mediante el
workflow de GitHub Actions (`.github/workflows/deploy.yml`).

**Deploy manual desde la CLI:**
```bash
# Frontend
railway up --service=av-frontend --detach

# Backend
railway up --service=av-backend --detach
```

### Paso 7: Verificar health checks

Después del despliegue, verificar que ambos servicios estén saludables:

```bash
# Health check del frontend
curl https://av.railway.app/

# Health check del backend
curl https://av-backend.railway.internal/api/actuator/health
```

También se puede verificar desde el dashboard de Railway en la pestaña **Deployments**.

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `railway status` | Ver estado de servicios |
| `railway logs --service=av-backend` | Ver logs del backend |
| `railway logs --service=av-frontend` | Ver logs del frontend |
| `railway variables list` | Listar variables de entorno |
| `railway variables set KEY=VALUE` | Agregar variable de entorno |
| `railway up --service=NAME` | Desplegar un servicio |
| `railway rollback` | Revertir al último deploy |
| `railway open` | Abrir el proyecto en el navegador |

## Troubleshooting

### El deploy falla con "Build failed"

**Causa común:** error de compilación en el backend.
- Revisar los logs: `railway logs --service=av-backend`
- Verificar que `./mvnw package` compile sin errores localmente
- Asegurarse de que el `Dockerfile` esté en la raíz del directorio `backend/`

### Error de conexión a PostgreSQL

**Causa común:** la variable `DATABASE_URL` no está configurada.
- Verificar que el servicio PostgreSQL esté agregado al proyecto
- Railway asigna `DATABASE_URL` automáticamente; si no aparece, desconectar y
  reconectar el servicio de base de datos al servicio backend desde el dashboard

### El frontend no puede comunicarse con el backend

**Causa común:** CORS o URL incorrecta.
- Verificar que `VITE_API_URL` apunte al dominio correcto
- Si el backend usa dominio público, usar esa URL; si usa URL interna de Railway,
  verificar que ambos servicios estén en el mismo proyecto
- Revisar que `CORS_ALLOWED_ORIGINS` incluya el dominio del frontend

### "railway up" no encuentra el servicio

**Causa común:** el servicio no existe en Railway o el nombre no coincide.
- Verificar el nombre exacto en el dashboard: `railway status`
- Asegurarse de que el `RAILWAY_TOKEN` corresponda al proyecto correcto
- Usar `--service=NOMBRE_EXACTO` (sensible a mayúsculas/minúsculas)

### El Project Token no funciona en GitHub Actions

**Causas comunes:**
- Se usó un Account Token en lugar de un Project Token
- El token expiró (revisar en Project → Settings → Tokens)
- El secreto `RAILWAY_TOKEN` no está configurado en el repositorio correcto
- El proyecto no está linkeado: ejecutar `railway link` localmente primero

## Documentación oficial

- [Railway Docs](https://docs.railway.com)
- [Railway Config-as-Code](https://docs.railway.com/reference/config-as-code)
- [Railway CLI Reference](https://docs.railway.com/reference/cli)
- [Railway Monorepo Guide](https://docs.railway.com/guides/monorepo)
- [Railway GitHub Integration](https://docs.railway.com/deploy/github)
