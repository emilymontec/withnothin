<div align="center">
  
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/readme_assets/withnothin.svg">
  <source media="(prefers-color-scheme: light)" srcset="docs/readme_assets/withnothin-dark.svg">
  <img alt="WithNothin" src="docs/readme_assets/withnothin.svg" width="350">
</picture>

</div>

<p align="center">
  <strong>social platform where the tech community shares what they're building, learning, and stuck on — not just the finished result.</strong>
</p>

<p align="center">
  <a href="#">Take a Look</a> ·
  <a href="#">Join the Community</a> ·
  <a href="#">Docs</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/web-next.js-e6e6e6?style=flat-square" alt="web" />
  <img src="https://img.shields.io/badge/api-nestjs-black?style=flat-square" alt="api" />
  <img src="https://img.shields.io/badge/mobile-kotlin/compose-e6e6e6?style=flat-square" alt="mobile" />
  <img src="https://img.shields.io/badge/db-supabase-black?style=flat-square" alt="db" />
</p>

---

<p align="justify">
WITHNOTHIN is a social network built for people in tech — beginners, professionals, and experts alike — around a simple idea: <br> <strong>everyone starts with nothin'</strong>.<br> It exists to normalize the real, messy process of learning, building, and getting stuck, instead of only rewarding the polished, finished result. It is not a clone of LinkedIn, Instagram, Dev.to, or Stack Overflow; it is a space designed specifically around how developers actually share progress — through builds, questions, ideas, and the problems they haven't solved yet.
</p>

<p align="justify">
The project ships as a full monorepo — a Next.js web client, a NestJS REST API, and a native Android app built with Kotlin and Jetpack Compose — sharing a single PostgreSQL database through Supabase. Every core module described below was implemented end-to-end across all three surfaces, following a phased technical roadmap that took the product from architecture definition to a fully featured social graph with posts, follows, projects, communities, moderation, and rule-based recommendations.
</p>

<!-- <img width="1414" height="937" alt="WithNothin feed preview" src="docs/readme_assets/home.png" /> -->

---

## What you can do on WithNothin

<table>
<tr>
<td width="50%" valign="top">

### Share your process

<p align="justify">
Post what you're <strong>building</strong>, what you're <strong>learning</strong>, where you're <strong>stuck</strong>, an <strong>idea</strong> you haven't started yet, a finished <strong>showcase</strong>, something worth others <strong>discovering</strong>, or a technical <strong>question</strong>. Seven post types, one feed, tagged with the technologies involved.
</p>

</td>
<td width="50%" valign="top">

### Build your graph

<p align="justify">
Follow other builders, see a personalized feed of what they're posting, save what matters for later, and get notified when someone likes, comments, or follows you back.
</p>

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Organize the work

<p align="justify">
Group related posts under a <strong>Project</strong> with its own members and links, or gather people around a shared <strong>Community</strong> — join, post, and moderate without needing a separate platform.
</p>

</td>
<td width="50%" valign="top">

### Trust and moderation

<p align="justify">
Block, mute, and report — with an admin layer to review reports and manage users, plus rule-based suggestions for who to follow and which technologies to explore next.
</p>

</td>
</tr>
</table>

---

## Features

| | |
|---|---|
| **Posts** | Seven post types (`BUILD`, `LEARN`, `STUCK`, `QUESTION`, `IDEA`, `SHOWCASE`, `DISCOVER`) with technologies, tags, media, comments, and likes. |
| **Feed & Follows** | A personalized, cursor-paginated feed computed from who you follow — no separate feed table. |
| **Q&A** | Questions live as a post type; accepted answers and signed voting (+1 / −1) give them dedicated behavior. |
| **Projects** | Owner/member roles, linked technologies, and posts that reference a single project. |
| **Communities** | Slugged, joinable spaces with their own feed and owner-managed membership. |
| **Notifications & Saves** | Persisted, polled notifications for likes, comments, and follows, plus a personal saved-posts list. |
| **Search** | Combined search across posts, profiles, and technologies. |
| **Moderation** | Independent `reports`, `blocks`, and `mutes` modules, enforced in the feed in both directions. |
| **Admin & Recommendations** | Role-gated (`USER` / `ADMIN`) user and report management, plus rule-based follow and technology suggestions. |
| **Mobile Parity** | Every module above is also implemented natively in the Android app, not just the web client. |

---

## Architecture

<p align="justify">
WithNothin is organized as a <strong>multi-level monorepo</strong>, with a modular-monolith API, a feature-based Next.js web app, and an MVVM + Clean Architecture Android app, all sharing typed contracts through a common package.
</p>

```
withnothin/
├── apps/
│   ├── api/                  # NestJS + TypeScript, modular by domain
│   ├── mobile/               # Kotlin + Jetpack Compose, MVVM
│   └── web/                  # Next.js (App Router) + TypeScript
├── packages/
│   ├── shared-config/        # Shared tsconfig / lint base
│   └── shared-types/         # Types shared between API and web
└── docs/                     # Architecture, API and design documentation
```

<p align="justify">
On the backend, each domain — auth, users, profiles, posts, comments, likes, follows, feed, saves, notifications, search, moderation, projects, answers, votes, communities, admin, and recommendations — is its own NestJS module with its own policy, tests, and Prisma-backed tables. Authentication is handled by Supabase, verified against a custom `SupabaseJwtStrategy`, with users provisioned just-in-time on first request. The web client mirrors that structure feature by feature, using Zustand for session state and TanStack Query for data fetching, while the Android app follows the same domain boundaries through Retrofit API clients and dedicated ViewModels per screen.
</p>

### How the pieces communicate

```
apps/web    ─┐
             ├─▶  apps/api (NestJS)  ─▶  PostgreSQL (Prisma)
apps/mobile ─┘            │
                          └─▶  Supabase (Auth · Storage · signed URLs)
```

---

## Getting Started

<p align="justify">
The project is fully implemented in code; the steps below take it from a fresh clone to a running local environment.
</p>

```bash
# 1. Install dependencies (pnpm workspaces)
pnpm install

# 2. Configure environment variables for each app
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# 3. Point Prisma at your Postgres/Supabase instance and run the first migration
pnpm --filter api prisma migrate dev

# 4. Start web + api together (or use the Docker Compose setup for local dev)
pnpm dev
```

<p align="justify">
The Android app lives in <code>apps/mobile</code> and opens directly in Android Studio; it expects your Supabase URL and anon key via <code>BuildConfig</code>. A Gradle Wrapper still needs to be generated locally the first time you build it, since it is not checked into the repository.
</p>

---

## Author

**Emily Monterrosa Castro - Full Stack Developer** <br>
[GitHub](https://github.com/emilymontec) · [LinkedIn](https://www.linkedin.com/in/emilymontec/) · [Portfolio](https://emilymontec.github.io/portfolio/)


<!--
---

## License

 License.

See the [LICENSE](LICENSE) file for additional information.

---

## Appendices
See the [UserGuide]() to learn more.

If you want to know more about the system, please check the [Documentation]().
-->


---

<p align="center">
  <strong>Everyone starts with nothin'.</strong>
</p>