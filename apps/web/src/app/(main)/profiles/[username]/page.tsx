'use client';

import { useParams } from 'next/navigation';
import { useProfileByUsername } from '@/features/profiles/hooks/use-profile';
import { FollowButton } from '@/features/follows/components/follow-button';
import { ModerationActions } from '@/features/moderation/components/moderation-actions';
import { useFollowers, useFollowing } from '@/features/follows/hooks/use-follows';
import { usePosts } from '@/features/posts/hooks/use-posts';
import { PostCard } from '@/features/posts/components/post-card';
import styles from './profile-detail.module.css';

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const { data: profile, isLoading, isError } = useProfileByUsername(params.username);
  const { data: followers = [] } = useFollowers(profile?.userId ?? '');
  const { data: following = [] } = useFollowing(profile?.userId ?? '');
  const { data: posts = [] } = usePosts({ authorId: profile?.userId });

  if (isLoading) {
    return <p>Cargando perfil...</p>;
  }

  if (isError || !profile) {
    return <p>No encontramos este perfil.</p>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2>{profile.displayName}</h2>
          <p className={styles.username}>@{profile.username}</p>
          {profile.headline && <p>{profile.headline}</p>}
          {profile.bio && <p>{profile.bio}</p>}
          <p className={styles.stats}>
            {followers.length} seguidores · {following.length} seguidos
          </p>
        </div>
        <FollowButton profileUserId={profile.userId} />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <ModerationActions profileUserId={profile.userId} />
      </div>

      <hr className={styles.divider} />

      <h3>Posts</h3>
      {posts.length === 0 && <p>Todavía no publicó nada.</p>}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
