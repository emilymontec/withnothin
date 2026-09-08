/**
 * Tipos de publicación soportados por WithNothin.
 *
 * IMPORTANTE: agregar un nuevo tipo aquí NO requiere una nueva tabla ni
 * migración estructural. Los campos específicos de cada tipo viven en
 * `posts.metadata` (JSONB) — ver `PostMetadataByType` más abajo.
 */
export enum PostType {
  BUILD = 'BUILD',       // "I built this."
  LEARN = 'LEARN',       // "I'm learning Kotlin."
  STUCK = 'STUCK',       // "I'm stuck with NestJS."
  QUESTION = 'QUESTION', // "How would you solve this?"
  IDEA = 'IDEA',         // "What project could I build to practice PHP?"
  SHOWCASE = 'SHOWCASE', // "Finally finished my first Android app."
  DISCOVER = 'DISCOVER', // Recursos y descubrimientos.
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  FOLLOWERS = 'FOLLOWERS',
  PRIVATE = 'PRIVATE',
}

export enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
}

export enum ReportTargetType {
  POST = 'POST',
  COMMENT = 'COMMENT',
  USER = 'USER',
}
