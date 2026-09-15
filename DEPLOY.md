# Guía de despliegue — WithNothin

## 1. Base de datos

### 1.1 Motor
PostgreSQL 16. Prisma es la única vía de acceso a la base — no se escribe SQL a mano
salvo migraciones puntuales.

### 1.2 Proveer la instancia
Dos opciones, sin cambios de código entre una y otra (`DATABASE_URL` es lo único que cambia):

- **Supabase Postgres** (recomendado para empezar — misma plataforma que Auth/Storage): crear el proyecto en Supabase, tomar el connection string de *Project Settings → Database → Connection string* (usar el **pooler** en `6543` para la API en producción, no el puerto directo `5432`).
- **Postgres gestionado aparte** (RDS, Cloud SQL, Neon, Railway, etc.): cualquiera sirve, Prisma no depende de Supabase para la base en sí.

### 1.3 Migraciones
```bash
cd apps/api
npx prisma generate          # genera el client — requiere descargar el query engine
npx prisma migrate deploy    # aplica migraciones pendientes, uso en CI/CD
npx prisma migrate dev       # solo en desarrollo, genera nuevas migraciones
```
`migrate deploy` es el comando correcto para producción: no crea migraciones nuevas, solo aplica las que ya están en `apps/api/src/database/prisma/migrations/`. Correrlo como paso previo al arranque de la API en cada release (ver sección 3).

### 1.4 Variables de conexión
| Variable | Ejemplo | Notas |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:6543/postgres?pgbouncer=true` | Si es Supabase con pooler, agregar `?pgbouncer=true&connection_limit=1` para que Prisma no abra más conexiones persistentes de las que el pooler permite. |

### 1.5 Backups
- Si es Supabase: backups diarios automáticos incluidos en el plan Pro; point-in-time recovery disponible como add-on.
- Si es Postgres propio: `pg_dump` programado (cron/CI nocturno) hacia un bucket de object storage, o usar el backup gestionado del proveedor (RDS/Cloud SQL lo dan out-of-the-box).

### 1.6 Índices y constraints
Ya definidos en `schema.prisma` (uniques en `slug`, `username`, `email`; índices en foreign keys de alto volumen como `postId` en likes/saves/comments). No requieren acción manual — se aplican solos vía migraciones.

---

## 2. Configuración de Supabase (Auth + Storage)

WithNothin usa Supabase solo para **Auth** y **Storage** — la lógica de negocio y los datos viven en Postgres vía NestJS, Supabase no es la fuente de verdad de nada más.

### 2.1 Auth
1. Crear el proyecto en Supabase (si no se reutiliza el mismo de la base de datos).
2. *Authentication → Providers*: habilitar Email/Password (o los providers que correspondan).
3. *Authentication → URL Configuration*: configurar `Site URL` y `Redirect URLs` con el dominio real de la web en producción.
4. Tomar de *Project Settings → API*:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (**solo en el backend**, nunca en el cliente web/Android — tiene permisos de admin)
5. *Project Settings → API → JWT Settings*: copiar el JWT Secret → `JWT_PUBLIC_KEY_OR_SECRET` (usado por NestJS para verificar los tokens que emite Supabase; la API **nunca emite tokens propios**).

### 2.2 Storage
1. *Storage*: crear el bucket (nombre libre, ej. `media`) → `SUPABASE_STORAGE_BUCKET` / `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`.
2. Marcarlo como bucket privado (no público) — la API genera signed URLs de subida y lectura, el bucket no debe ser listable/legible directo.
3. Policies de Storage: solo el `service_role` necesita acceso amplio; no hace falta abrir policies a `anon`/`authenticated` porque todo el acceso pasa por signed URLs emitidas desde el backend.

---

## 3. Configuración de despliegue

### 3.1 Variables de entorno — API (`apps/api/.env`)
| Variable | Requerida | Ejemplo / notas |
|---|---|---|
| `NODE_ENV` | sí | `production` |
| `PORT` | sí | `4000` |
| `DATABASE_URL` | sí | ver sección 1.4 |
| `SUPABASE_URL` | sí | ver sección 2.1 |
| `SUPABASE_ANON_KEY` | sí | ver sección 2.1 |
| `SUPABASE_SERVICE_ROLE_KEY` | sí | secreto — nunca loguear ni exponer |
| `SUPABASE_STORAGE_BUCKET` | no | default interno si no se define |
| `JWT_PUBLIC_KEY_OR_SECRET` | sí | ver sección 2.1 |
| `CORS_ORIGIN` | sí | dominio exacto de la web en producción, ej. `https://withnothin.com` (sin `*` en producción) |

La app **falla al arrancar** si falta o es inválida cualquiera de estas (`env.validation.ts`) — es intencional, evita fallos silenciosos en runtime.

### 3.2 Variables de entorno — Web (`apps/web/.env`)
| Variable | Requerida | Notas |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | sí | URL pública de la API, ej. `https://api.withnothin.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | sí | igual que `SUPABASE_URL` del backend |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | sí | igual que `SUPABASE_ANON_KEY` del backend — es pública por diseño (Supabase la protege con RLS/policies, no por ocultarla) |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | no | idem backend |

Todo lo que empieza con `NEXT_PUBLIC_` queda embebido en el bundle del cliente — nunca poner ahí el `service_role` key.

### 3.3 Build y contenedores
Dockerfiles multi-stage ya listos en `apps/api/Dockerfile` y `apps/web/Dockerfile` (build con pnpm workspaces, runtime liviano sobre `node:20-alpine`). Para levantar todo junto (Postgres local + API + Web):
```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d --build
```
En producción normalmente **no** se usa el Postgres del compose (se apunta `DATABASE_URL` a Supabase o al Postgres gestionado) — ese servicio del compose es para desarrollo/staging local.

### 3.4 Orden de despliegue recomendado
1. Aplicar migraciones (`prisma migrate deploy`) contra la base de producción.
2. Desplegar la API (contiene la lógica de negocio; la web depende de que ya esté arriba).
3. Desplegar la web, apuntando `NEXT_PUBLIC_API_URL` a la API ya desplegada.
4. Verificar `GET /api/v1/health` (o el endpoint de salud que corresponda) antes de enrutar tráfico real.

### 3.5 Plataformas sugeridas (sin atarse a una)
- **API (contenedor Docker)**: Railway, Render, Fly.io, o cualquier ECS/Cloud Run — no requiere nada específico de un proveedor.
- **Web (Next.js)**: Vercel es la opción de menor fricción (soporta el App Router nativamente); alternativamente, el mismo contenedor Docker en cualquier plataforma de contenedores.
- **CI/CD**: el workflow base ya está en `.github/workflows/` — build + test en cada PR; agregar el paso de `prisma migrate deploy` + build/push de imágenes en el workflow de release.

### 3.6 CORS y dominios
`CORS_ORIGIN` en la API debe ser el dominio **exacto** de la web en producción (no `*`) — el proyecto ya está armado para eso (`app.enableCors({...})` en `main.ts`). Si hay múltiples entornos (staging + producción), cada uno necesita su propio valor de `CORS_ORIGIN` correspondiente a su propia web.

### 3.7 Checklist previo a producción
- [ ] `NODE_ENV=production` (esto también apaga Swagger, ver `main.ts`)
- [ ] `CORS_ORIGIN` apunta al dominio real, no a `localhost` ni `*`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` solo está en las variables del backend, no en la web ni en el bundle de Android
- [ ] Bucket de Storage privado, no público
- [ ] `DATABASE_URL` usa el pooler de Supabase (puerto `6543`) si la API corre en un entorno serverless/con muchas instancias
- [ ] Migraciones aplicadas (`prisma migrate deploy`) antes de desplegar el código nuevo
- [ ] Backups configurados (sección 1.5)