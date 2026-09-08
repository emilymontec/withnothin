# WithNothin

> Everyone starts with nothin.

Red social/comunidad para personas del mundo tecnológico: principiantes,
profesionales y expertos que comparten lo que construyen, lo que aprenden
y los problemas en los que se atascan.

## Estructura del monorepo

```
WithNothin/
├── apps/
│   ├── web/          # Next.js + TypeScript
│   ├── api/           # NestJS + TypeScript (REST)
│   └── mobile/        # Kotlin + Jetpack Compose
├── packages/
│   ├── shared-types/   # Contratos TS compartidos entre web y api
│   └── shared-config/  # tsconfig/eslint base
├── infrastructure/
│   ├── docker/         # docker-compose de desarrollo local
│   └── ci-cd/
├── docs/                # Documentación viva del proyecto
└── .github/workflows/   # CI
```

## Empezar a desarrollar

Ver [`docs/development/ONBOARDING.md`](./docs/development/ONBOARDING.md).

## Estado del proyecto

Ver el roadmap técnico completo y checkeable en el documento de arquitectura
compartido con el equipo. Fase actual: **Fase 1 — Fundación del proyecto**.

## Stack

| Capa | Tecnología |
|---|---|
| Web | Next.js, TypeScript, TanStack Query, Zustand, Zod |
| Backend | NestJS, TypeScript, Prisma, PostgreSQL |
| Auth/Storage | Supabase Auth, Supabase Storage |
| Mobile | Kotlin, Jetpack Compose, Retrofit, Hilt, Coroutines |
| Infraestructura | Docker, GitHub Actions |
