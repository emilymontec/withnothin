# Desarrollo local — WithNothin

Esta guía levanta el entorno completo (API + Web + Postgres) en tu máquina.

## Requisitos

- Node.js 20+
- pnpm 9+ (`corepack enable` lo instala automáticamente — ver paso 1)
- Docker y Docker Compose
- JDK 17 (solo si vas a trabajar en `apps/mobile`)
- Android Studio (Koala o superior) — solo para `apps/mobile`
- Una cuenta/proyecto de Supabase (Auth + Storage) — ver `docs/deployment/`

## 1. Clonar e instalar dependencias JS

```bash
git clone <repo-url> WithNothin
cd WithNothin
corepack enable          # habilita pnpm sin instalarlo manualmente
pnpm install
```

Esto instala las dependencias de `apps/web`, `apps/api` y `packages/*` en un solo paso (pnpm workspaces, definidos en `pnpm-workspace.yaml`).

## 2. Configurar variables de entorno

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Completa `apps/api/.env` con las credenciales reales de tu proyecto de Supabase
(`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). Sin esto,
la API fallará al arrancar (falla rápido por diseño — ver `env.validation.ts`).

## 3. Levantar Postgres local

Puedes usar el Postgres de Supabase directamente, o uno local para desarrollo
sin depender de red:

```bash
pnpm run docker:up
```

Esto levanta `postgres`, `api` y `web` en contenedores. Para desarrollo
día a día con hot-reload, es más cómodo el paso 4 (correr api/web fuera de Docker).

## 4. Correr API y Web en modo desarrollo (hot-reload)

En dos terminales separadas:

```bash
pnpm run dev:api   # http://localhost:4000/api/v1
pnpm run dev:web   # http://localhost:3000
```

Verifica que la API responde:

```bash
curl http://localhost:4000/api/v1/health
```

La documentación interactiva de la API (Swagger) está disponible en
`http://localhost:4000/api/docs`.

## 5. Migraciones de base de datos (Prisma)

```bash
pnpm --filter @withnothin/api prisma:generate
pnpm --filter @withnothin/api prisma:migrate
pnpm --filter @withnothin/api prisma:seed
```

## 6. Proyecto Android

Abrir `apps/mobile/` directamente en Android Studio (proyecto Gradle
independiente, no participa del workspace de pnpm).

Antes de compilar, sobreescribe los valores de `defaultConfig` en
`apps/mobile/app/build.gradle.kts` (`API_BASE_URL`, `SUPABASE_URL`,
`SUPABASE_ANON_KEY`) con tus valores reales, idealmente vía variables
en tu `local.properties` (no versionado) en vez de commitear las claves.
`http://10.0.2.2:4000/api/v1/` es la dirección correcta si usas el
emulador de Android Studio para apuntar a tu API corriendo en
`localhost`.

## Convenciones de branching y commits

- `main`: siempre desplegable.
- `develop`: integración de features en curso.
- Ramas de feature: `feature/<modulo>-<descripcion-corta>` (ej. `feature/posts-create-endpoint`).
- Commits: se recomienda [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`).

## Dónde encontrar cada cosa

| Necesito... | Voy a... |
|---|---|
| Entender la arquitectura completa | `docs/architecture/` |
| Ver el contrato de la API | `docs/api/` (Swagger generado) |
| Ver el roadmap y qué fase sigue | raíz del repo, `withnothin-roadmap.md` |
| Entender un tipo de post (BUILD, STUCK...) | `docs/product/` |
