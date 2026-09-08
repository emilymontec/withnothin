# WithNothin — Arquitectura Técnica Inicial

> "Everyone starts with nothin."
> Documento de arquitectura base. No implementa funcionalidades — define estructura, responsabilidades y decisiones antes de escribir código.

---

## 1. Arquitectura General Básica

```
WithNothin/
├── apps/
│   ├── web/                     # Next.js — cliente web
│   ├── api/                     # NestJS — backend/API REST
│   └── mobile/                  # Kotlin + Jetpack Compose — Android
│
├── packages/
│   ├── shared-types/            # Tipos/contratos TS compartidos entre web y api (DTOs, enums)
│   ├── shared-config/           # Configuración común (eslint, tsconfig, prettier)
│   └── ui/                      # (futuro) Design system compartido si web crece en múltiples clientes web
│
├── infrastructure/
│   ├── docker/                  # Dockerfiles y docker-compose por entorno
│   ├── ci-cd/                   # Pipelines (GitHub Actions)
│   └── env/                     # Plantillas de variables de entorno (.env.example por app)
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── mobile/
│   ├── web/
│   ├── security/
│   ├── deployment/
│   ├── development/
│   └── product/
│
├── .github/                     # Workflows, templates de PR/issues
├── .gitignore
├── package.json                 # Monorepo raíz (workspaces)
├── turbo.json / nx.json         # (evaluar, ver sección 13)
└── README.md
```

**Responsabilidad de cada carpeta principal:**

- **apps/**: código ejecutable, cada app es independiente y desplegable por separado.
- **packages/**: código que NO es una aplicación, sino algo consumido por más de una app. No se crea un paquete "por si acaso"; solo cuando hay duplicación real entre `web` y `api` (tipos de DTOs, enums de tipos de post, etc.).
- **infrastructure/**: todo lo relacionado con cómo se ejecuta y despliega el sistema, separado del código de negocio.
- **docs/**: documentación viva, versionada junto al código.

**Nota sobre monorepo:** Con 3 apps (web, api, mobile) y un backend Node + un backend Android (lenguaje distinto), no es indispensable una herramienta de monorepo compleja (Nx, Turborepo) desde el día uno. Recomendación: usar **npm/pnpm workspaces** simple para `apps/web`, `apps/api` y `packages/*`. Android vive en el mismo repo físico pero es un proyecto Gradle independiente, no participa del workspace de JS. Turborepo puede añadirse después si el build empieza a doler (ver sección 13).

---

## 2. Arquitectura Tecnológica

```
Web (Next.js)  ─┐
                 ├──►  API (NestJS, REST)  ──►  PostgreSQL
Android (Kotlin)┘              │
                                ├──►  Supabase Auth   (verificación de identidad)
                                ├──►  Supabase Storage (archivos/imágenes)
                                └──►  Supabase Realtime (futuro condicional)
```

- **Web → API**: HTTP/REST, vía un API client tipado (fetch/axios) usando los contratos de `shared-types`.
- **Android → API**: HTTP/REST, vía Retrofit, usando los mismos endpoints y el mismo contrato JSON.
- **API es el único punto de contacto con la base de datos.** Ni Web ni Android acceden a PostgreSQL o a Supabase directamente para lógica de negocio.
- **Supabase** se usa como proveedor de infraestructura (Auth, Storage), NO como backend principal. NestJS sigue siendo dueño de la lógica de negocio y de las reglas del dominio. Esto se justifica en la sección 9 y 13.
- La comunicación es siempre **Cliente → API → Base de datos/Servicios**, nunca Cliente → Servicio directamente, excepto en el caso puntual de subida de archivos con signed URLs (sección 10), que sigue siendo autorizado por la API.

---

## 3. Arquitectura del Backend (NestJS)

```
apps/api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/                       # Carga y validación de env vars (@nestjs/config + Joi/Zod)
│   │
│   ├── common/                       # Transversal, sin lógica de negocio propia de un dominio
│   │   ├── filters/                  # Exception filters (manejo centralizado de errores)
│   │   ├── interceptors/             # Logging, transform de respuesta, timeout
│   │   ├── decorators/                # @CurrentUser(), @Public(), etc.
│   │   ├── pipes/                    # Validación/transform genérica
│   │   ├── guards/                   # AuthGuard, RolesGuard (base, reutilizable)
│   │   └── pagination/               # DTO y helpers de paginación estándar
│   │
│   ├── database/
│   │   ├── prisma/ (o typeorm/)      # Cliente ORM, migraciones, schema
│   │   └── seeds/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   └── strategies/           # JWT strategy, integración Supabase Auth
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   ├── profiles/
│   │   ├── posts/
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts      # Casos de uso: createPost, publishPost...
│   │   │   ├── posts.repository.ts
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   └── policies/             # Reglas: quién puede editar/borrar
│   │   ├── comments/
│   │   ├── likes/
│   │   ├── follows/
│   │   ├── feed/
│   │   ├── technologies/
│   │   ├── projects/
│   │   ├── communities/
│   │   ├── questions/
│   │   ├── notifications/
│   │   ├── media/
│   │   ├── search/
│   │   └── moderation/
│   │
│   └── shared/                       # Servicios técnicos usados por varios módulos
│       ├── storage/                  # Wrapper sobre Supabase Storage (signed URLs)
│       └── mailer/                   # (si aplica)
│
├── test/
│   ├── unit/
│   └── e2e/
├── .env.example
└── Dockerfile
```

**Separación por capa dentro de cada módulo:**

| Capa | Responsabilidad |
|---|---|
| Controller | Recibe HTTP, valida forma de entrada (DTO), delega, devuelve respuesta. Sin lógica de negocio. |
| Service (casos de uso) | Reglas de negocio, orquestación, decisiones. |
| Repository | Única capa que habla con la base de datos (vía ORM). |
| DTO | Contratos de entrada/salida, con `class-validator`. |
| Entity | Representación de dominio/tabla. |
| Guards/Policies | Quién puede hacer qué (autenticación vs autorización). |

Esto es **Clean Architecture aplicada de forma pragmática**, no estricta (no se crean casos de uso como clases individuales por cada acción salvo que el módulo lo justifique, p. ej. `posts` o `moderation`). Se evita sobreingeniería: no hay capa de "use cases" separada del service si el service ya cumple ese rol con claridad.

---

## 4. Arquitectura Web (Next.js)

```
apps/web/
├── src/
│   ├── app/                          # App Router — solo rutas y composición de página
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (main)/
│   │   │   ├── layout.tsx
│   │   │   ├── feed/page.tsx
│   │   │   ├── posts/[id]/page.tsx
│   │   │   ├── profiles/[username]/page.tsx
│   │   │   ├── projects/[id]/page.tsx
│   │   │   ├── communities/[slug]/page.tsx
│   │   │   └── questions/[id]/page.tsx
│   │   └── layout.tsx                # Root layout
│   │
│   ├── features/                     # Organización por dominio, no por tipo de archivo
│   │   ├── posts/
│   │   │   ├── components/           # PostCard, PostForm, PostTypeBadge...
│   │   │   ├── hooks/                # useCreatePost, usePost
│   │   │   ├── services/             # postsApi.ts (llamadas a /posts)
│   │   │   ├── types/
│   │   │   └── schemas/              # Validación (zod)
│   │   ├── auth/
│   │   ├── profiles/
│   │   ├── feed/
│   │   ├── projects/
│   │   ├── communities/
│   │   ├── questions/
│   │   └── notifications/
│   │
│   ├── components/ui/                # Design system genérico (Button, Input, Modal...)
│   │                                  # SOLO componentes sin conocimiento de dominio
│   ├── lib/
│   │   ├── api-client.ts             # Cliente HTTP base (fetch wrapper, auth header)
│   │   ├── auth/                     # Sesión, integración Supabase Auth (cliente)
│   │   └── utils/
│   │
│   ├── hooks/                        # Hooks genéricos no ligados a un feature (useDebounce...)
│   ├── stores/                       # Estado global (Zustand) — solo lo que no es server state
│   └── styles/
│
├── public/
├── .env.example
└── Dockerfile
```

**Regla clave:** `components/` global solo contiene UI genérica reutilizable (design system). Todo lo que tiene conocimiento de un dominio (posts, proyectos, comunidades) vive dentro de `features/<dominio>`. Esto evita la "carpeta components gigante".

**State management:** Server state (datos que vienen de la API: posts, feed, perfiles) se maneja con **TanStack Query** (cache, revalidación, paginación). Client/UI state (modales abiertos, tema, filtros locales) con **Zustand** o `useState`. No se necesita Redux: el estado global real es pequeño.

**Validación:** **Zod**, compartiendo esquemas cuando sea razonable con los DTOs del backend (a través de `packages/shared-types` o duplicando definiciones simples — evaluar según fricción real).

---

## 5. Arquitectura Android (Kotlin + Jetpack Compose)

```
app/
├── src/main/java/com/withnothin/app/
│   ├── App.kt                        # Application class (Hilt)
│   ├── MainActivity.kt
│   │
│   ├── core/
│   │   ├── network/
│   │   │   ├── ApiClient.kt          # Retrofit + OkHttp config
│   │   │   ├── AuthInterceptor.kt
│   │   │   └── ApiResult.kt          # Wrapper de éxito/error
│   │   ├── di/                       # Módulos Hilt (Network, Database, Repository)
│   │   ├── navigation/               # NavGraph, rutas
│   │   └── ui/theme/                 # Design system (Color, Type, Theme.kt)
│   │
│   ├── data/
│   │   ├── remote/
│   │   │   ├── dto/                  # Modelos de red (espejo de los DTOs de la API)
│   │   │   └── service/              # Interfaces Retrofit (PostsApi, AuthApi...)
│   │   ├── local/
│   │   │   └── db/                   # Room (solo si hay necesidad real de cache offline)
│   │   └── repository/               # Implementación de los repositorios (Impl)
│   │
│   ├── domain/                       # Solo donde aporte valor (reglas propias del cliente)
│   │   ├── model/                    # Modelos de dominio (desacoplados del DTO de red)
│   │   └── repository/               # Interfaces de repositorio
│   │
│   └── feature/                      # Organización por pantalla/dominio
│       ├── auth/
│       │   ├── ui/                   # Composables
│       │   ├── AuthViewModel.kt
│       │   └── AuthUiState.kt
│       ├── feed/
│       ├── posts/
│       ├── profile/
│       ├── projects/
│       ├── communities/
│       └── notifications/
│
└── build.gradle.kts
```

**Patrón:** MVVM + capa de dominio ligera (no Clean Architecture completa desde el día 1; se introduce `domain/` solo donde el ViewModel necesitaría lógica compleja, ej. reglas de feed local).

**Decisiones de librerías:**

| Necesidad | Elección | Justificación |
|---|---|---|
| Networking | **Retrofit + OkHttp** | Estándar de facto Android, integración directa con interceptors para JWT. Ktor Client se justificaría si hubiera código Kotlin Multiplatform compartido — no es el caso aún. |
| Concurrencia | **Coroutines + Flow** | Estándar moderno de Android, integración nativa con Compose (`collectAsState`). |
| DI | **Hilt** | Estándar recomendado por Google, reduce boilerplate frente a Dagger puro. |
| Persistencia local | **Room — condicional** | Solo se agrega cuando exista una necesidad real de: (a) cache offline del feed, o (b) borradores de publicaciones. No se agrega "porque sí" en la v1. |
| Navegación | **Navigation Compose** | Estándar oficial. |

No se agregan librerías de state management adicionales (MVI frameworks, etc.) hasta que la complejidad de estado lo justifique.

---

## 6. Módulos

| Módulo | Clasificación | Notas |
|---|---|---|
| Auth | **CORE** | Base de todo lo demás |
| Users | **CORE** | |
| Profiles | **CORE** | |
| Posts | **CORE** | Corazón funcional del producto |
| Technologies / Tags | **CORE** | Los posts dependen de esto |
| Comments | **CORE** | |
| Likes | **CORE** | |
| Follows | **CORE** | |
| Feed | **CORE** | |
| Media/Storage | **CORE** | Los posts necesitan imágenes desde el inicio |
| Notifications | **SECONDARY** | Puede lanzarse con una versión mínima (solo persistidas, sin push) |
| Saves | **SECONDARY** | |
| Projects (+ Members, Technologies, Links, Posts) | **SECONDARY** | Diferenciador fuerte, pero puede llegar en v1.1 |
| Questions / Answers / Votes | **SECONDARY** | Requiere Posts y Comments maduros primero |
| Search / Explore / Trending | **SECONDARY** | Empieza simple (búsqueda SQL), evoluciona después |
| Reports / Block / Mute (moderación básica) | **SECONDARY** | Necesario en cuanto hay usuarios reales, pero no en el MVP cerrado |
| Communities | **FUTURE** | Alto costo de diseño (roles, moderación propia); no es núcleo del diferenciador inicial |
| Recommendations | **FUTURE** | Requiere datos de comportamiento que aún no existen |
| Admin Dashboard completo | **FUTURE** | Se empieza con acciones administrativas puntuales vía API/DB, no un panel completo |
| Roles/Permissions granulares | **FUTURE** | v1 puede vivir con roles simples (`user`, `admin`) |
| Sessions avanzadas (multi-dispositivo, revocación) | **FUTURE** | v1 usa sesión estándar vía Supabase Auth/JWT |

**Orden recomendado de implementación:**
1. Auth + Users + Profiles
2. Technologies/Tags + Media/Storage
3. Posts (con sus tipos: BUILD, LEARN, STUCK, QUESTION, IDEA, SHOWCASE, DISCOVER) + Comments + Likes
4. Follows + Feed
5. Saves + Notifications (básicas)
6. Search/Explore (básico)
7. Reports/Block (moderación mínima)
8. Projects
9. Questions/Answers
10. Communities
11. Recommendations + Admin Dashboard completo

---

## 7. Entidades Principales

**Identidad**
- `users` (id, email, password_hash*, created_at, deleted_at)
  *si Supabase Auth gestiona credenciales, `password_hash` puede no vivir en esta tabla — ver sección 9.
- `profiles` (user_id FK 1:1, display_name, bio, avatar_url, location, links, headline)
- `sessions` — delegado a Supabase Auth en v1 (no se modela tabla propia salvo necesidad futura)

**Social**
- `posts` (id, author_id FK→users, type [enum], content, status, visibility, created_at, updated_at, deleted_at)
- `post_media` (id, post_id FK, url, type, order)
- `post_technologies` (post_id FK, technology_id FK) — **N:M**
- `post_tags` (post_id FK, tag_id FK) — **N:M**
- `comments` (id, post_id FK, author_id FK, content, parent_comment_id FK nullable, created_at, deleted_at)
- `likes` (user_id FK, post_id FK, created_at) — PK compuesta (user_id, post_id)
- `saves` (user_id FK, post_id FK, created_at) — PK compuesta
- `follows` (follower_id FK, followee_id FK, created_at) — PK compuesta, constraint follower≠followee

**Tech**
- `technologies` (id, name, slug, category)
- `tags` (id, name, slug)
- `user_technologies` (user_id FK, technology_id FK, level) — **N:M**

**Projects** *(secondary)*
- `projects` (id, owner_id FK, name, description, status, created_at)
- `project_members` (project_id FK, user_id FK, role) — **N:M**
- `project_technologies` (project_id FK, technology_id FK) — **N:M**
- `project_links` (id, project_id FK, label, url)

**Community** *(future)*
- `communities` (id, name, slug, description, owner_id FK)
- `community_members` (community_id FK, user_id FK, role)

**Questions** *(secondary)*
- `questions` (id, post_id FK nullable o entidad propia — decisión pendiente, ver sección 13)
- `answers` (id, question_id FK, author_id FK, content, is_accepted)
- `votes` (user_id FK, answer_id FK, value) — N:M con valor

**Soporte**
- `notifications` (id, user_id FK, type, payload jsonb, read_at, created_at)
- `reports` (id, reporter_id FK, target_type, target_id, reason, status, created_at)

**Convenciones transversales:**
- Todas las tablas: `created_at`, `updated_at` (timestamps automáticos).
- Soft delete (`deleted_at`) en: `users`, `posts`, `comments`, `projects`, `communities`. No en tablas puramente relacionales (`likes`, `follows`) — ahí se borra físicamente.
- Índices: FKs siempre indexadas; índice compuesto en tablas de unión (`post_id, user_id`); índice en `posts.type`, `posts.created_at` (feed), `posts.visibility`.
- Restricciones: `UNIQUE(user_id, post_id)` en likes/saves; `CHECK(follower_id <> followee_id)` en follows; `NOT NULL` en FKs obligatorias.
- Auditoría: se pospone una tabla genérica de auditoría (`audit_logs`) hasta que exista necesidad real de trazabilidad (ej. acciones de moderación) — entonces se crea específica para `moderation_actions`.

---

## 8. API — Organización de Endpoints

Convención: **REST, plural, versión en path.**

```
/api/v1/auth/*            login, register, refresh, logout
/api/v1/users/:id
/api/v1/profiles/:username
/api/v1/posts
/api/v1/posts/:id
/api/v1/posts/:id/comments
/api/v1/posts/:id/likes
/api/v1/posts/:id/saves
/api/v1/technologies
/api/v1/follows
/api/v1/feed
/api/v1/notifications
/api/v1/search
/api/v1/projects
/api/v1/questions
```

**Convenciones:**

| Aspecto | Regla |
|---|---|
| HTTP methods | GET (leer), POST (crear), PATCH (actualizar parcial), DELETE (soft delete cuando aplique) |
| Status codes | 200 OK, 201 Created, 204 No Content, 400 Validation, 401 No autenticado, 403 No autorizado, 404 No encontrado, 409 Conflicto, 422 Entidad inválida, 429 Rate limit, 500 Error interno |
| Request DTOs | Uno por operación (`CreatePostDto`, `UpdatePostDto`), validados con `class-validator` |
| Response DTOs | Uno por recurso, nunca se expone la Entity directamente (se usa `PostResponseDto`) |
| Paginación | Cursor-based para feed (`?cursor=&limit=`), offset-based para listados administrativos simples (`?page=&limit=`) |
| Filtrado | Query params explícitos (`?type=BUILD&technology=kotlin`), whitelisted por el DTO de query |
| Ordenamiento | `?sort=recent|popular` con valores controlados (enum), nunca SQL crudo desde el cliente |
| Búsqueda | `/search?q=&type=` — endpoint dedicado, no mezclado con listados normales |
| Errores | Formato uniforme: `{ statusCode, message, error, path, timestamp }` vía filtro global |
| Auth | JWT (Bearer) emitido/validado con soporte de Supabase Auth; guard global con excepción explícita (`@Public()`) |
| Autorización | Guards + Policies por recurso (ej. solo el autor o un admin puede borrar un post) |

La misma API sirve a Web y Android sin variantes — ningún endpoint "solo para app" o "solo para web". Si en el futuro se requieren respuestas más livianas para mobile, se resuelve con query params (`?fields=`), no con endpoints duplicados.

---

## 9. Seguridad

| Decisión | Detalle |
|---|---|
| Autenticación | **Supabase Auth** gestiona identidad (registro, login, verificación de email, recuperación de contraseña, hashing de password). NestJS valida el JWT emitido por Supabase en cada request. Evita reimplementar hashing/flows de auth manualmente. |
| Autorización | Responsabilidad exclusiva de **NestJS** (guards + policies). Supabase no decide reglas de negocio de quién puede editar qué. |
| Password hashing | Delegado a Supabase Auth (usa estándares probados internamente) — NestJS no maneja contraseñas en texto ni hashes propios. |
| Tokens/sesión | JWT de corta duración + refresh token, gestionados por Supabase Auth; NestJS solo verifica firma/expiración. |
| Validación de entrada | `class-validator` + `class-transformer` en cada DTO; whitelist estricta (rechaza campos no declarados). |
| Rate limiting | `@nestjs/throttler` en endpoints sensibles (login, creación de posts, comentarios) desde el día uno. |
| CORS | Configurado explícitamente en NestJS: solo orígenes conocidos (web app, y futuro dominio). |
| CSRF | No aplica de forma clásica al ser API stateless con Bearer token (no cookies de sesión por defecto); si se usa cookie httpOnly para el web, se añade protección CSRF específica en ese flujo. |
| XSS | Next.js escapa por defecto en render; contenido generado por usuario (posts/comentarios) se sanitiza antes de renderizar como HTML si se permite formato enriquecido. |
| SQL Injection | Mitigado por uso exclusivo de ORM (Prisma/TypeORM) con queries parametrizadas; sin SQL crudo concatenado. |
| Upload validation | Tipo MIME, extensión, tamaño máximo validados en NestJS antes de emitir signed URL; Supabase Storage con reglas de bucket restringidas. |
| Moderación/Reportes/Bloqueo | Módulo `moderation` propio (secondary), sin dependencias externas. |
| Secrets | Variables de entorno, nunca en el repo; `.env.example` documenta claves requeridas sin valores reales. |

No se inventan mecanismos propios de auth o cifrado: se usa Supabase Auth (estándar basado en GoTrue/JWT) y librerías reconocidas del ecosistema NestJS.

---

## 10. Storage y Media

```
Usuario
  ↓
Web/Android solicita a NestJS: "quiero subir una imagen"
  ↓
NestJS valida (tipo, tamaño, autenticación) y genera un Signed URL de Supabase Storage
  ↓
Cliente sube el archivo DIRECTAMENTE a Supabase Storage usando ese Signed URL
  ↓
Cliente notifica a NestJS: "subida completada" (con la referencia/path del archivo)
  ↓
NestJS valida la referencia y la guarda en PostgreSQL (post_media)
  ↓
El Post queda vinculado a la media
```

**Por qué este flujo:**
- **Upload directo a Supabase Storage (no a través de NestJS)** evita que el backend cargue con tráfico binario pesado, mejora latencia y escala mejor.
- **NestJS sigue siendo el punto de control**: nadie sube nada sin que la API lo autorice primero (signed URL con expiración corta) y sin que la API confirme y registre la referencia después. Esto evita subidas arbitrarias directas al bucket.
- **Validación en dos momentos**: antes de emitir el signed URL (tipo/tamaño declarado) y opcionalmente una verificación posterior (ej. Cloud Function o job liviano) para confirmar que el archivo real corresponde a lo declarado.
- **Compresión/resizing**: se pospone a una etapa posterior (Sharp en un endpoint/job, o transformaciones on-the-fly de Supabase Storage si el plan lo soporta) — no es bloqueante para el MVP, pero se documenta como pendiente antes de lanzar con tráfico real de imágenes.
- **Límites**: tamaño máximo por imagen (ej. 5MB) y tipos permitidos (jpg, png, webp, gif) definidos como configuración, no hardcodeados.

---

## 11. Infraestructura y Deploy

**Fase inicial:**

```
┌─────────────┐    ┌─────────────┐    ┌────────────────────┐
│   Web        │    │   API        │    │  PostgreSQL         │
│  (Next.js)   │───►│  (NestJS)     │───►│  (Supabase managed) │
│  Docker      │    │  Docker       │    └────────────────────┘
└─────────────┘    └─────────────┘             │
                                                 ├── Supabase Auth
                                                 └── Supabase Storage
```

- **Web**: contenedor Docker desplegado en un servicio simple (Vercel es una alternativa nativa para Next.js si se prefiere no gestionar Docker para el frontend — a evaluar, ver sección 13).
- **API**: contenedor Docker en un servicio gestionado (Railway, Render, Fly.io, o VPS propio con Docker Compose).
- **Base de datos**: Postgres gestionado por Supabase — evita operar backups/replicación manualmente en esta fase.
- **CI/CD**: GitHub Actions — lint + test + build en cada PR; deploy automático a `main`/`staging`.
- **Variables de entorno**: por app (`apps/api/.env`, `apps/web/.env`), gestionadas como secrets en el proveedor de CI/hosting.
- **Logs**: logs estructurados de NestJS (JSON) enviados a la plataforma de hosting; sin stack de logging dedicado (ELK, etc.) todavía.
- **Monitoring**: healthcheck endpoint (`/health`) + monitoring básico del proveedor de hosting. Sentry (o similar) para errores de Web/API desde el inicio — es barato de introducir y de alto valor.
- **Backups**: gestionados por Supabase (backups automáticos de Postgres) en la fase inicial.

**Fase futura (no implementar ahora, solo dejar previsto):**

| Tecnología | Cuándo tendría sentido |
|---|---|
| Redis | Cuando el feed o sesiones necesiten cache de lectura de alto tráfico, o para rate limiting distribuido entre múltiples instancias de la API. |
| Background jobs / Queue (BullMQ, etc.) | Cuando aparezcan tareas asíncronas reales: procesamiento de imágenes, envío masivo de notificaciones, cálculo de trending. |
| Search engine (Meilisearch/Typesense/Elasticsearch) | Cuando la búsqueda por SQL (`ILIKE`/`tsvector`) deje de ser suficiente en volumen o relevancia. |
| CDN | Cuando el tráfico de imágenes/assets estáticos sea significativo (Supabase Storage ya sirve vía CDN básico; un CDN dedicado se evalúa si se migra de proveedor de storage). |
| WebSockets / Supabase Realtime | Cuando se necesiten notificaciones en vivo o presencia (ej. "usuario X está escribiendo"). No es necesario para un feed que se actualiza por refresco/polling. |
| Microservicios | Solo si un módulo concreto (ej. `notifications` o `search`) tiene una carga y un ciclo de despliegue tan distinto al resto que justifique separarlo — no antes. |

---

## 12. Documentación

| Carpeta | Contenido |
|---|---|
| `docs/architecture/` | Este documento, diagramas de alto nivel, decisiones de arquitectura (ADRs) |
| `docs/api/` | Especificación de endpoints (OpenAPI/Swagger generado desde NestJS), convenciones de la API |
| `docs/database/` | Diagrama entidad-relación, diccionario de tablas, políticas de migraciones |
| `docs/mobile/` | Convenciones Android, estructura de módulos, guía de contribución mobile |
| `docs/web/` | Convenciones de features/componentes, guía de estilo, decisiones de state management |
| `docs/security/` | Modelo de amenazas básico, políticas de auth/autorización, checklist de seguridad por PR |
| `docs/deployment/` | Cómo desplegar cada app, variables de entorno requeridas, runbook de incidentes |
| `docs/development/` | Cómo levantar el entorno local, convenciones de commits/branching, guía de onboarding |
| `docs/product/` | Definición de tipos de post, glosario del dominio (qué es un "STUCK", un "SHOWCASE"...), roadmap funcional |

---

## 13. Decisiones Arquitectónicas

1. **Modular Monolith, no microservicios.** Equipo pequeño, producto en validación. Los microservicios agregan complejidad operativa (deploys independientes, comunicación entre servicios, observabilidad distribuida) sin beneficio real hasta que exista escala o equipos separados por dominio.

2. **Supabase como infraestructura, no como backend.** Se usa Auth y Storage porque resuelven problemas genéricos y bien resueltos (identidad, archivos) sin valor diferencial en reimplementarlos. La lógica de negocio (qué es un post, quién puede comentar, cómo se arma el feed) permanece en NestJS para no acoplar el dominio a las capacidades/limitaciones de una plataforma de terceros.

3. **PostgreSQL como única fuente de verdad del dominio.** Aunque Supabase ofrece su propio Postgres, se trata como "el Postgres del proyecto", no como un servicio caja negra: el control de esquema, migraciones y queries vive en NestJS vía ORM.

4. **REST sobre GraphQL.** Con dos consumidores (Web, Android) y un equipo que recién arranca, REST es más simple de razonar, cachear y depurar. GraphQL se reconsideraría si aparecen múltiples clientes con necesidades de datos muy distintas entre sí.

5. **Organización por features/dominio en Web y por módulos en API.** Ambas decisiones persiguen lo mismo: que el proyecto escale en funcionalidades sin escalar en desorden. Facilita además que un agente de IA o un nuevo desarrollador entienda "todo lo de posts está en un solo lugar".

6. **Tipos de post modelados como un `enum` + tabla de metadatos, no como tablas separadas por tipo.** Un `BUILD` y un `QUESTION` comparten 90% de su estructura (autor, contenido, tecnologías, comentarios). Modelarlos como subtipos de `posts` (columna `type`) permite añadir nuevos tipos (ej. `RESOURCE`) sin nueva tabla ni migración estructural — solo un nuevo valor de enum y, si acaso, campos opcionales específicos en un JSONB `metadata` para no romper el esquema con cada tipo nuevo.

7. **Preparación para desarrollo asistido por IA.** Módulos con límites claros (un dominio = una carpeta = una responsabilidad), convenciones de nombres consistentes, y DTOs explícitos hacen que un agente de IA pueda trabajar dentro de un módulo sin necesitar contexto de todo el sistema. Se recomienda mantener por módulo un `README.md` corto describiendo su responsabilidad y sus límites (qué NO hace ese módulo).

8. **Pendiente de decidir (no bloqueante para arrancar):**
   - Prisma vs TypeORM como ORM (ambos válidos; Prisma suele ofrecer mejor DX y tipado, TypeORM se integra más "nativamente" al estilo decorators de NestJS).
   - Turborepo/Nx vs workspaces simples — empezar simple, migrar si el build lo justifica.
   - `questions` como entidad propia vs. un tipo especial de `posts` — impacta el modelo de `answers`/`votes`. Se recomienda evaluarlo al llegar a ese módulo (fase 9 del roadmap), no ahora.
   - Vercel vs Docker propio para el hosting de Web.

---

## 14. Riesgos

- **Acoplamiento a Supabase Auth**: migrar de proveedor de auth en el futuro implica reemigrar usuarios/tokens. Mitigación: mantener `users.id` como UUID propio y no depender de IDs internos de Supabase en el resto del dominio, para que un cambio de proveedor de Auth sea aislable.
- **Modelo de `posts` genérico puede volverse difícil de consultar** si cada tipo termina necesitando muchos campos específicos en el JSONB `metadata` sin disciplina. Mitigación: revisar cada 2-3 tipos nuevos si alguno merece pasar a tener tablas/relaciones propias.
- **Feed performante a escala**: un feed cronológico simple con SQL funciona bien al inicio, pero no escalará indefinidamente con `follows` masivos. Mitigación: diseñar la query de feed desde el inicio pensando en paginación por cursor e índices adecuados, aunque la lógica de "ranking" siga siendo simple.
- **Ambigüedad de límites entre `Posts` y `Questions`**: si no se define pronto si una pregunta es "un post con propiedades extra" o una entidad separada, puede generar duplicación de lógica de comentarios/votos. Mitigación: decidirlo explícitamente antes de implementar el módulo `questions` (no antes, no es bloqueante hoy).
- **Riesgo de sobre-modularizar el frontend prematuramente**: crear `features/` para dominios que aún no existen (ej. `communities` antes de tener 3 pantallas reales) puede generar carpetas vacías o mal diseñadas. Mitigación: crear una carpeta de feature solo cuando el dominio tenga al menos una pantalla real.
- **Dependencia de un solo desarrollador/equipo pequeño para mantener 3 código bases (web, api, android)**: riesgo de inconsistencia entre contratos de API. Mitigación: mantener `docs/api/` (OpenAPI) como fuente de verdad y generarlo automáticamente desde NestJS (`@nestjs/swagger`), no escrito a mano.

---

## 15. Roadmap Técnico

1. **Fundación**: monorepo, workspaces, Docker base, CI mínimo (lint+test), conexión API↔Postgres, Supabase Auth integrado.
2. **Identidad**: Auth, Users, Profiles (web + endpoints; Android puede empezar en paralelo consumiendo la misma API).
3. **Base de contenido**: Technologies/Tags, Media/Storage (flujo de subida completo).
4. **Núcleo social**: Posts (todos los tipos), Comments, Likes.
5. **Grafo social**: Follows, Feed (versión cronológica simple).
6. **Retención**: Saves, Notifications básicas.
7. **Descubribilidad mínima**: Search/Explore simple (SQL).
8. **Confianza**: Reports, Block/Mute (moderación mínima) — antes de abrir el producto públicamente.
9. **Diferenciador extendido**: Projects.
10. **Q&A**: Questions/Answers/Votes (con la decisión de modelado ya tomada).
11. **Comunidad estructurada**: Communities.
12. **Inteligencia**: Recommendations, Trending, Admin Dashboard completo.

---

## Decisiones pendientes antes de comenzar a codificar

1. ORM definitivo: Prisma vs TypeORM.
2. Herramienta de monorepo: workspaces simples vs Turborepo/Nx (recomendación: empezar simple).
3. Hosting de Web: Vercel vs contenedor Docker propio.
4. Modelado de `questions`: entidad propia vs especialización de `posts`.
5. Alcance exacto del campo `metadata` (JSONB) por tipo de post — qué campos tiene cada tipo (BUILD, LEARN, STUCK, QUESTION, IDEA, SHOWCASE, DISCOVER).
6. Política de visibilidad de posts (público / solo seguidores / privado) — impacta el diseño del feed desde el inicio.
7. Definición de roles iniciales (¿solo `user` y `admin`, o se necesita `moderator` desde el día uno?).
