export interface Profile {
  userId: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  headline: string | null;
  location: string | null;
  createdAt: string;
}

export interface CreateProfileInput {
  username: string;
  displayName: string;
  bio?: string;
  headline?: string;
  location?: string;
}
