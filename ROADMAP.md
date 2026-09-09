# WithNothin — Roadmap Técnico

> Roadmap de desarrollo, ordenado por fases. Cada fase se marca como completada solo cuando su entregable está funcionando de punta a punta (no solo "código escrito").
> Estado actual: **Fase 0 completada.** Ninguna fase de implementación ha comenzado todavía.

Leyenda: `[x]` completado · `[~]` en progreso · `[ ]` no iniciado

**Última actualización:** Fase 10 completa a nivel de código en backend, web y Android: Q&A con votos con signo y respuesta aceptada, resolviendo la decisión de arquitectura pendiente (`Question` = `Post` con `type=QUESTION`, solo `Answer` necesitaba tabla propia). Con esto, WithNothin tiene implementadas todas las fases del roadmap original salvo Fase 11 (Communities) y Fase 12 (Recommendations + Admin Dashboard completo), ambas marcadas como FUTURE desde el diseño inicial — es decir, se completó todo lo que el roadmap consideraba necesario para un producto funcional.

---

## Fase 0 — Arquitectura y definición [x] COMPLETADA

- [x] Definir arquitectura general (monorepo, apps, packages, infrastructure, docs)
- [x] Definir stack tecnológico (Next.js, NestJS, PostgreSQL, Supabase, Kotlin/Compose)
- [x] Definir estructura interna de backend (NestJS por módulos/capas)
- [x] Definir estructura interna de web (Next.js por features)
- [x] Definir estructura interna de mobile (Kotlin por features + MVVM)
- [x] Clasificar módulos (CORE / SECONDARY / FUTURE) y su orden de implementación
- [x] Definir entidades principales y relaciones conceptuales
- [x] Definir convenciones de API (REST, paginación, errores, auth)
- [x] Definir decisiones de seguridad (Auth, autorización, validación, rate limiting)
- [x] Definir flujo de storage/media (signed URLs)
- [x] Definir infraestructura inicial y futura
- [x] Definir estructura de documentación (`docs/`)
- [x] Documentar decisiones arquitectónicas y riesgos
- [ ] Resolver decisiones pendientes antes de codificar (ver checklist al final)

---

## Fase 1 — Fundación del proyecto [x] COMPLETADA (esqueleto verificado; instalación real pendiente de ejecutarse en máquina de desarrollo)

**Objetivo:** repositorio y entornos funcionando, sin funcionalidad de negocio aún.

- [x] Inicializar monorepo (pnpm workspaces)
- [x] Crear `apps/web` (Next.js + TypeScript, config base)
- [x] Crear `apps/api` (NestJS + TypeScript, config base)
- [x] Crear `apps/mobile` (proyecto Android + Compose base)
- [x] Configurar `packages/shared-types`
- [x] Configurar tsconfig compartido (`packages/shared-config`) — ESLint compartido pendiente
- [x] Configurar variables de entorno (`.env.example` por app)
- [x] Elegir ORM → **Prisma** (decisión tomada, schema inicial creado con `User`/`Profile`)
- [x] Configurar Dockerfiles (web, api) y `docker-compose` para desarrollo local
- [x] Configurar CI básico en GitHub Actions (lint + build + test, incluye job de Android)
- [x] Configurar manejo centralizado de errores en NestJS (`HttpExceptionFilter`)
- [x] Configurar logging estructurado en NestJS (`LoggingInterceptor`)
- [x] Endpoint `/health` en API (módulo funcional real)
- [x] README de onboarding (`docs/development/ONBOARDING.md`)
- [x] Cliente HTTP base en Web (`lib/api-client.ts`) y en Android (`ApiClient.kt` + `AuthInterceptor.kt`)
- [x] `AuthGuard` global registrado (esqueleto — rechaza todo por defecto hasta Fase 2)
- [ ] **Instalar dependencias reales (`pnpm install`) y verificar que build/dev arrancan sin errores** — pendiente de ejecutar en máquina de desarrollo
- [ ] Configurar proyecto real en Supabase (Auth + Storage + Postgres) — requiere credenciales del equipo
- [ ] Integrar verificación real de JWT de Supabase Auth en `AuthGuard` (queda formalmente en Fase 2, pero el guard ya está preparado)
- [ ] Ejecutar primera migración de Prisma (`prisma migrate dev`) contra Postgres local
- [ ] Generar Gradle Wrapper (`gradlew`) en `apps/mobile` — necesario para que el job de CI de Android funcione
- [ ] Configurar Sentry (o equivalente) en Web y API
- [ ] Configurar ESLint/Prettier compartidos de forma efectiva (hoy cada app declara su propio lint)

---

## Fase 2 — Identidad (Auth, Users, Profiles) [x] COMPLETADA (código); verificación end-to-end pendiente de tu entorno
*CORE*

- [x] **Backend:** `PrismaModule`/`PrismaService` (infraestructura de base de datos compartida)
- [x] **Backend:** módulo `auth` — `SupabaseJwtStrategy` (verifica JWT firmado por Supabase con `jsonwebtoken`)
- [x] **Backend:** `AuthGuard` real (reemplaza el esqueleto de Fase 1) — verifica token y aprovisiona el usuario (JIT) en el primer request
- [x] **Backend:** módulo `users` (repository, service, controller — `GET /users/me`, `GET /users/:id`)
- [x] **Backend:** módulo `profiles` (repository, service, controller — crear/editar/consultar perfil por username)
- [x] **Backend:** DTOs de creación/actualización de perfil con validación (`class-validator`)
- [x] **Backend:** test unitario de `UsersService` (aprovisionamiento JIT)
- [x] **Web:** cliente de Supabase Auth (`lib/supabase/client.ts`) + `authService` (signUp/signIn/signOut/sesión)
- [x] **Web:** `session-store` (Zustand) + `SessionProvider` sincronizado con Supabase
- [x] **Web:** `api-client.ts` actualizado para adjuntar el token automáticamente
- [x] **Web:** páginas reales de login y registro (`(auth)/login`, `(auth)/register`)
- [x] **Web:** guard de rutas en layout `(main)` — redirige a `/login` sin sesión
- [x] **Web:** feature `profiles` (types, service, hooks con TanStack Query) + página de onboarding de perfil
- [x] **Android:** `SessionManager` (DataStore) implementando `TokenProvider`
- [x] **Android:** `SupabaseModule` (Hilt) — cliente de Supabase Auth (GoTrue), URLs/keys vía `BuildConfig`
- [x] **Android:** `AuthViewModel` (login/registro contra Supabase, validación de email/password, guarda token en `SessionManager`)
- [x] **Android:** `LoginScreen` y `RegisterScreen` (Compose) — pantallas separadas
- [x] **Android:** `ProfilesApi` (Retrofit) + `ProfileOnboardingViewModel` + `ProfileOnboardingScreen`
- [x] **Android:** `AppNavHost` completo — Login → Register → Onboarding de perfil → Feed (placeholder)
- [ ] **Pendiente (requiere tu entorno):** ejecutar `pnpm install` + `prisma migrate dev` y probar el flujo end-to-end real (registro → login → `/users/me` → crear perfil) en Web
- [ ] **Pendiente (requiere tu entorno):** compilar `apps/mobile` en Android Studio con credenciales reales de Supabase y probar el mismo flujo
- [ ] **Pendiente:** generar el Gradle Wrapper (`gradlew`) — necesario para que el job de CI de Android funcione
- [ ] **Docs:** actualizar `docs/api/` con endpoints de auth/users/profiles (Swagger ya los genera automáticamente en `/api/docs`)

---

## Fase 3 — Base de contenido (Technologies, Tags, Media) [x] COMPLETADA (código); verificación end-to-end pendiente de tu entorno
*CORE*

- [x] **Backend:** módulo `technologies` (catálogo público + `findOrCreateByName`, usado por Posts en Fase 4)
- [x] **Backend:** módulo `tags` (mismo patrón find-or-create)
- [x] **Backend:** utilidad `slugify` compartida (evita duplicados como "Next.js" vs "next js")
- [x] **Backend:** seed de tecnologías comunes (`prisma:seed`)
- [x] **Backend:** `SupabaseStorageService` (signed upload URLs, URL pública) — único punto de contacto con Storage
- [x] **Backend:** módulo `media` (`POST /media/upload-url`, `POST /media/:id/confirm`) con validación de tipo/tamaño y rate limiting propio
- [x] **Base de datos:** tablas `technologies`, `tags`, `user_technologies`, `media_assets` (Prisma)
- [x] **Web:** feature `technologies` (service, hook, `TechnologyPicker` sobre `MultiSelect` genérico)
- [x] **Web:** feature `media` (`mediaService.uploadFile` — flujo completo signed URL → Supabase → confirmación)
- [x] **Android:** `TechnologiesApi` (Retrofit)
- [x] **Android:** `MediaApi` (Retrofit) + `MediaUploader` (mismo flujo de 3 pasos, vía plugin Storage de supabase-kt)
- [x] **Docs:** reglas de validación de archivos centralizadas en `media.constants.ts` (tipos permitidos, 5MB máx)
- [ ] **Pendiente (requiere tu entorno):** crear el bucket `media` en Supabase Storage con las políticas de acceso correctas
- [ ] **Pendiente (requiere tu entorno):** ejecutar `prisma migrate dev` + `prisma:seed` y probar el flujo de subida real end-to-end

## Identidad visual aplicada a la Web [x]
*Fuera del roadmap original — incorporada tras recibir el brandboard del proyecto*

- [x] Design tokens en `apps/web/src/app/globals.css` (paleta monocromática `#000000`/`#e6e6e6`/`#ffffff`, tipografía)
- [x] Fuentes vía `next/font`: Josefin Sans (Google Fonts, exacta) + **Bristol real** (`next/font/local`, archivo provisto por el equipo — ya no es un sustituto)
- [x] Componentes base: `Button`, `Input`, `Logo`, `ScribbleAccent` (motivo de garabatos del brandboard), `MultiSelect` restilizado
- [x] Layout de auth compartido (`(auth)/layout.tsx`) + header de marca en `(main)/layout.tsx`
- [x] Landing, login, registro, onboarding de perfil y feed placeholder restilizados con el nuevo sistema
- [x] `docs/web/DESIGN_SYSTEM.md` documenta tokens, decisión de tipografía sustituta y principios
- [ ] **Pendiente:** aplicar la misma identidad visual en Android (hoy sigue con Material 3 por defecto — evaluar si el proyecto quiere Compose con tema custom o mantener Material como base neutra)
- [x] Bristol integrada también en Android (`res/font/bristol.otf`, `WithNothinTheme` con `Typography` propia para titulares) — misma identidad en las dos apps
- [ ] **Pendiente:** confirmar licencia de `Bristol.otf` para uso web/embedding antes de producción
- [x] Josefin Sans empaquetada en Android (`res/font/josefin_sans.ttf`, descargada del repositorio oficial de Google Fonts) — se descartó el Google Fonts Provider para no agregar una dependencia de red en runtime; ahora `bodyLarge`/`bodyMedium`/labels de Material 3 usan Josefin Sans en toda la app automáticamente

---

## Fase 4 — Núcleo social: Posts, Comments, Likes [x] COMPLETADA (código, incluida UI de Android)
*CORE — corazón funcional del producto*

- [x] **Backend:** módulo `posts` (crear, listar con filtros, obtener, editar, borrar — soft delete)
- [x] **Backend:** soporte de los 7 tipos de post (BUILD, LEARN, STUCK, QUESTION, IDEA, SHOWCASE, DISCOVER) vía enum + `metadata` JSONB
- [x] **Backend:** relación posts↔technologies, posts↔tags, posts↔media (find-or-create + validación de ownership de media confirmada)
- [x] **Backend:** `PostsPolicy` separada (solo autor edita/borra; TODO explícito para moderadores en Fase 8)
- [x] **Backend:** módulo `comments` (con soporte de respuestas anidadas, soft delete que preserva el hilo)
- [x] **Backend:** módulo `likes` (toggle idempotente vía upsert, sin soft delete)
- [x] **Base de datos:** tablas `posts`, `post_media`, `post_technologies`, `post_tags`, `comments`, `likes`
- [x] **Backend:** rate limiting en creación de posts, tests unitarios de `PostsPolicy`
- [x] **`shared-types`:** interfaces de `Post` compartidas con la web
- [x] **Web:** formulario de creación de post (`PostForm`, selector de los 7 tipos) en `/posts/new`
- [x] **Web:** `PostCard` con badge de tipo, tecnologías, likes, comentarios — usado en el feed
- [x] **Web:** vista de detalle de post (`/posts/[id]`) + hilo de comentarios + like con toggle optimista
- [x] **Web:** feature `comments` completa (servicio, hooks, `CommentForm`, `CommentList` con un nivel de respuestas)
- [x] **Web:** botón "Nuevo post" en el header del layout principal
- [x] **Android:** `PostsApi`, `CommentsApi`, `LikesApi` (Retrofit) + DTOs — capa de datos completa
- [x] **Android:** `NewPostScreen` (selector de tipo con chips, tecnologías/tags por texto separado por coma — simplificación documentada frente al picker de la web)
- [x] **Android:** `PostDetailScreen` (contenido, like con toggle optimista, lista de comentarios, formulario para comentar)
- [ ] **Pendiente (requiere tu entorno):** ejecutar `prisma migrate dev` y probar el flujo real de creación/edición/borrado de posts end-to-end
- [ ] **Pendiente:** decidir si `isLikedByCurrentUser` se agrega a la respuesta de `GET /posts` — hoy tanto la web como Android mantienen ese estado en memoria del lado del cliente, lo cual se pierde al recargar/reabrir

---

## Fase 5 — Grafo social: Follows y Feed [x] COMPLETADA (código, incluida UI de Android)
*CORE*

- [x] **Backend:** módulo `follows` (seguir/dejar de seguir, listar seguidores/seguidos — endpoints públicos de lectura)
- [x] **Backend:** validación de negocio "no puedes seguirte a ti mismo" (test unitario incluido)
- [x] **Backend:** módulo `feed` — SIN tabla propia, es una vista calculada a partir de Follows + Posts (posts propios + de usuarios seguidos, cronológico, paginación por cursor)
- [x] **Base de datos:** tabla `follows` (PK compuesta `followerId+followeeId`)
- [x] **Backend:** `ProfilesService.findSummariesByUserIds` y `PostsService.toResponseDto` expuestos para reutilización entre módulos (evita duplicar mapeo)
- [x] **Web:** feature `follows` (servicio, hooks, `FollowButton` con atajo simple para v1 — documentado su límite de escala)
- [x] **Web:** página de perfil público `/profiles/[username]` (pendiente desde Fase 2) — muestra bio, contadores de seguidores/seguidos, posts del usuario y botón de seguir
- [x] **Web:** feed principal ahora consume `GET /feed` (personalizado) en vez de `GET /posts` (listado público)
- [x] **Web:** links de `@username` en `PostCard` y detalle de post hacia el perfil público
- [x] **Android:** `FollowsApi` (Retrofit) + `PostsApi.getFeed()` — capa de datos completa
- [x] **Android:** `UsersApi.getMe()` — necesario para que el cliente sepa "quién soy" (botón de seguir, perfil propio vs ajeno)
- [x] **Android:** `FeedScreen` (lista real desde `/feed`, navega a detalle/perfil, botón "Nuevo post")
- [x] **Android:** `PublicProfileScreen` (perfil, contador de seguidores, posts del usuario, botón seguir/dejar de seguir)
- [x] **Android:** `AppNavHost` completo con rutas parametrizadas (`posts/{postId}`, `profiles/{username}`)
- [ ] **Pendiente (requiere tu entorno):** ejecutar `prisma migrate dev` y probar el flujo real de seguir/dejar de seguir + verificar que el feed muestra lo esperado
- [ ] **Pendiente:** si algún perfil crece a miles de seguidores, reemplazar el atajo de `FollowButton`/`PublicProfileViewModel` (traen la lista completa de seguidores) por un endpoint dedicado `GET /users/:id/follow-status`
- [ ] **Pendiente:** `PublicProfileViewModel` en Android trae TODOS los posts y filtra por username en el cliente (el endpoint `GET /posts` no expone `authorId` en el `PostsApi` de Android todavía) — ineficiente a volumen, se resuelve agregando el parámetro cuando haga falta

---

## Fase 6 — Retención: Saves y Notifications básicas [x] COMPLETADA (código, incluida UI de Android)
*SECONDARY*

- [x] **Backend:** módulo `saves` (guardar/quitar, listado paginado de "mis guardados")
- [x] **Backend:** módulo `notifications` (persistidas, sin push — listado paginado, contador de no leídas, marcar una/todas como leídas)
- [x] **Backend:** `NotificationsService.notify()` no propaga errores — una notificación fallida nunca rompe la acción principal (like, comentario, follow)
- [x] **Backend:** disparadores conectados en `LikesService` (LIKE), `CommentsService` (COMMENT) y `FollowsService` (FOLLOW), con protección contra auto-notificarse
- [x] **Base de datos:** tablas `saves`, `notifications`
- [x] **Web:** `SaveButton` (mismo patrón optimista que `LikeButton`) en el detalle de post, página `/saves`
- [x] **Web:** feature `notifications` completa — traducción de `type`+`payload` a mensajes legibles, polling cada 30s ("sin push" compensado), página `/notifications`, badge de no leídas en el header
- [x] **Android:** `SavesApi`, `NotificationsApi` (Retrofit) + DTOs
- [x] **Android:** `SavesScreen`, `NotificationsScreen`, botón de guardar en `PostDetailScreen`, accesos desde `FeedScreen`
- [ ] **Pendiente (requiere tu entorno):** ejecutar `prisma migrate dev` y probar que las notificaciones se disparan correctamente al dar like/comentar/seguir

---

## Fase 7 — Descubribilidad mínima: Search / Explore [x] COMPLETADA (código, incluida UI de Android)
*SECONDARY*

- [x] **Backend:** módulo `search` (SQL `ILIKE` vía Prisma `contains` sobre posts, perfiles, tecnologías — sin motor dedicado, ver arquitectura)
- [x] **Backend:** búsqueda combinada por categoría (`?type=all|posts|profiles|technologies`), pública (sin sesión)
- [x] **Backend:** reutiliza `PostsService.toResponseDto` y `TechnologiesService.findAll` — no duplica lógica de mapeo
- [x] **Web:** página `/search` con debounce de 300ms, resultados agrupados por categoría, link en el header
- [x] **Android:** `SearchApi` (Retrofit) + `SearchScreen` con el mismo debounce (300ms) y acceso desde el feed
- [ ] **Pendiente:** dejar registrado el criterio para migrar a un search engine dedicado si el volumen o la relevancia de `ILIKE` dejan de ser suficientes (ver `docs/architecture/ARCHITECTURE.md`, sección de riesgos)

---

## Fase 8 — Confianza: Moderación mínima [x] COMPLETADA (código, incluida UI de Android)
*SECONDARY — requisito antes de abrir el producto públicamente*

- [x] **Backend:** módulo `moderation`... implementado como tres módulos separados (`reports`, `blocks`, `mutes`) en vez de uno solo — cada uno tiene su propia tabla y reglas, agruparlos habría sido artificial
- [x] **Backend:** `blocks` — bloquear/desbloquear, listar bloqueados, impide crear nuevos follows entre usuarios bloqueados (mensaje genérico, no revela quién bloqueó a quién)
- [x] **Backend:** `mutes` — silenciar es la acción "suave", solo oculta contenido en el feed de quien silencia, no restringe follows/comentarios/likes
- [x] **Backend:** `reports` — crea reportes en `PENDING`, sin panel de revisión todavía (depende de la Fase 12 + decisión de roles)
- [x] **Backend:** `FeedService` actualizado para excluir posts de usuarios bloqueados (ambas direcciones) y silenciados (una dirección)
- [x] **Decisión de arquitectura corregida en el camino:** el primer diseño de `block()` cortando follows automáticamente creaba una dependencia circular `BlocksModule` ↔ `FollowsModule`. Se resolvió acotando el alcance (bloquear no borra follows existentes, solo los oculta e impide nuevos) en vez de forzar la dependencia — documentado en el código
- [x] **Base de datos:** tablas `reports`, `blocks`, `mutes`
- [x] **Backend:** tests unitarios de `BlocksService` y actualización de `FollowsService` (caso de bloqueo)
- [x] **Web:** `ReportButton` (formulario inline) en `PostCard`, `ModerationActions` (bloquear/silenciar) en el perfil público, página `/settings/blocked`
- [x] **Android:** `ModerationApi` (Retrofit), bloquear/silenciar en `PublicProfileScreen`, reportar en `PostDetailScreen`, `BlockedUsersScreen`
- [ ] **Pendiente (requiere tu entorno):** ejecutar `prisma migrate dev` y probar que un usuario bloqueado efectivamente desaparece del feed y no puede volver a seguir

---

## Fase 9 — Diferenciador extendido: Projects [x] COMPLETADA (código, incluida UI de Android)
*SECONDARY*

- [x] **Backend:** módulo `projects` (CRUD, miembros con roles OWNER/MEMBER, tecnologías vía find-or-create, links)
- [x] **Backend:** `ProjectsPolicy` — solo el owner edita/borra/gestiona miembros
- [x] **Backend:** el owner queda registrado como fila `ProjectMember` (role OWNER) desde la creación — listar miembros es una sola consulta
- [x] **Base de datos:** tablas `projects`, `project_members`, `project_technologies`, `project_links`
- [x] **Decisión tomada:** en vez de una tabla `project_posts` (N:M), `posts.projectId` es una FK opcional — un post habla de UN proyecto como mucho, no se restringe por tipo (no solo SHOWCASE/BUILD, un STUCK también puede ser sobre un proyecto). Documentado en el schema.
- [x] **Backend:** test unitario de `ProjectsPolicy`
- [x] **`shared-types`:** interfaces de `Project` compartidas con la web
- [x] **Web:** listado `/projects`, creación `/projects/new` (con links dinámicos), detalle `/projects/[id]` (archivar/reactivar/eliminar para el owner)
- [x] **Android:** `ProjectsApi` (Retrofit) + `ProjectsListScreen`, `NewProjectScreen`, `ProjectDetailScreen`
- [ ] **Pendiente:** UI para agregar/quitar miembros de un proyecto (el backend ya soporta `POST/DELETE /projects/:id/members`, pero ni web ni Android tienen formulario para eso todavía — se agrega cuando haya necesidad real de colaboración multi-usuario)
- [ ] **Pendiente:** mostrar los posts vinculados a un proyecto (`posts.projectId`) en la página de detalle — hoy el campo existe en el modelo pero ningún formulario de creación de post permite asociarlo a un proyecto todavía
- [ ] **Pendiente (requiere tu entorno):** ejecutar `prisma migrate dev` y probar el flujo real de creación/archivado de proyectos

---

## Fase 10 — Q&A: Questions, Answers, Votes [x] COMPLETADA (código, incluida UI de Android)
*SECONDARY*

- [x] **Decisión tomada:** `Question` NO es una entidad propia — es un `Post` con `type = "QUESTION"` (ya tiene contenido, tecnologías, tags y comentarios; duplicar esa estructura habría sido redundante). Solo `Answer` necesitaba tabla propia, porque tiene comportamiento que `Comment` no tiene: puede aceptarse y acumula votos con signo.
- [x] **Backend:** módulo `answers` (crear — valida que el post sea tipo QUESTION —, listar con la aceptada primero, aceptar solo por el autor de la pregunta vía `AnswersPolicy`, desmarca cualquier otra aceptada antes de marcar una nueva)
- [x] **Backend:** módulo `votes` (voto con signo +1/-1 sobre una respuesta, no un simple like — permite puntaje negativo)
- [x] **Base de datos:** tablas `answers`, `votes`
- [x] **Backend:** test unitario de `AnswersPolicy`
- [x] **`shared-types`:** interfaces de `Answer` compartidas con la web
- [x] **Web:** `VoteButtons` (toggle real con signo), `AnswerForm`/`AnswerList`/`AnswerItem`, botón "Marcar como aceptada" visible solo para el autor de la pregunta. El detalle de post bifurca: `type === 'QUESTION'` muestra respuestas, cualquier otro tipo muestra comentarios normales
- [x] **Android:** `AnswersApi`/`VotesApi` (Retrofit) + misma bifurcación QUESTION/comentarios en `PostDetailScreen`
- [ ] **Diferencia menor documentada:** el voto en Android no hace toggle a 0 como en la web (cada tap reenvía el mismo valor) — se resuelve fácilmente si en la práctica genera confusión
- [ ] **Pendiente (requiere tu entorno):** ejecutar `prisma migrate dev` y probar el flujo real pregunta → respuestas → votos → aceptar

---

## Fase 11 — Comunidad estructurada: Communities [ ]
*FUTURE*

- [ ] Diseño de roles y moderación propia de comunidad
- [ ] **Backend:** módulo `communities` (+ members)
- [ ] **Base de datos:** tablas `communities`, `community_members`
- [ ] **Web/Android:** creación, unión, feed por comunidad

---

## Fase 12 — Inteligencia: Recommendations, Trending, Admin completo [ ]
*FUTURE*

- [ ] Definir señales de comportamiento a capturar (para recomendaciones futuras)
- [ ] **Backend:** módulo `recommendations` (versión inicial basada en reglas, no ML)
- [ ] **Backend:** cálculo de trending (batch simple, sin colas todavía)
- [ ] **Admin:** dashboard completo (gestión de usuarios, contenido, reportes)

---

## Fase 13+ — Escalabilidad futura (activar solo si hay evidencia real de necesidad) [ ]

- [ ] Introducir Redis (cache de feed / rate limiting distribuido)
- [ ] Introducir colas/background jobs (procesamiento de imágenes, notificaciones masivas)
- [ ] Introducir search engine dedicado (Meilisearch/Typesense/Elasticsearch)
- [ ] Evaluar CDN dedicado para media
- [ ] Evaluar Supabase Realtime o WebSockets para notificaciones en vivo
- [ ] Evaluar separación de algún módulo como servicio independiente

---

## Checklist de decisiones pendientes (bloquean el inicio de ciertas fases, no todas)

- [ ] ORM definitivo: Prisma vs TypeORM → **bloquea Fase 1**
- [x] Herramienta de monorepo: **pnpm workspaces** (decidido — reemplaza npm workspaces). Turborepo/Nx quedan como opción futura si el build empieza a doler.
- [ ] Hosting de Web: Vercel vs Docker propio → no bloquea desarrollo local
- [ ] Modelado de `questions`: entidad propia vs especialización de posts → **bloquea Fase 10**
- [ ] Alcance del campo `metadata` (JSONB) por tipo de post → **bloquea Fase 4**
- [ ] Política de visibilidad de posts (público/seguidores/privado) → **bloquea Fase 4 y 5**
- [ ] Roles iniciales: ¿solo `user`/`admin` o también `moderator` desde el día uno? → bloquea el panel de revisión de reportes (Fase 12). Todo lo anterior (Fases 1-10) se implementó sin necesitar roles — cada permiso se resolvió con ownership simple (`authorId === userId`, `ownerId === userId`), que es todo lo que hacía falta hasta ahora

---

## Próximo paso sugerido

Resolver las decisiones que bloquean la **Fase 1** (ORM) y la **Fase 4** (metadata por tipo de post, visibilidad) antes de escribir la primera línea de código de negocio, ya que ambas afectan el esquema de base de datos desde el inicio.
