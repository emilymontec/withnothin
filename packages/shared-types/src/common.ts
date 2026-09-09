/**
 * Contratos genéricos compartidos entre apps/api y apps/web.
 * Android replica estos mismos contratos en sus DTOs de Retrofit
 * (Kotlin no puede importar este paquete directamente, pero debe
 * mantenerse en sincronía manualmente — ver docs/api/).
 */

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  path: string;
  timestamp: string;
}

export interface PostAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface PostTechnologyRef {
  id: string;
  name: string;
  slug: string;
}

export interface PostTagRef {
  id: string;
  name: string;
  slug: string;
}

export interface PostMediaRef {
  id: string;
  url: string;
}

export interface Post {
  id: string;
  type: string;
  content: string;
  status: string;
  visibility: string;
  metadata: Record<string, unknown> | null;
  author: PostAuthor;
  technologies: PostTechnologyRef[];
  tags: PostTagRef[];
  media: PostMediaRef[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectOwner {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface ProjectMemberRef {
  userId: string;
  username: string;
  displayName: string;
  role: string;
}

export interface ProjectLinkRef {
  id: string;
  label: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  owner: ProjectOwner;
  members: ProjectMemberRef[];
  technologies: PostTechnologyRef[];
  links: ProjectLinkRef[];
  createdAt: string;
  updatedAt: string;
}

export interface AnswerAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  votesScore: number;
  author: AnswerAuthor;
  createdAt: string;
}
