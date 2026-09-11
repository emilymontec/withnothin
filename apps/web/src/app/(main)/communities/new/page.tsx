'use client';

import { useRouter } from 'next/navigation';
import { CommunityForm } from '@/features/communities/components/community-form';
import { useCreateCommunity } from '@/features/communities/hooks/use-communities';
import type { CreateCommunityInput } from '@/features/communities/services/communities-service';

export default function NewCommunityPage() {
  const router = useRouter();
  const createCommunity = useCreateCommunity();

  async function handleSubmit(input: CreateCommunityInput) {
    const community = await createCommunity.mutateAsync(input);
    router.push(`/communities/${community.slug}`);
  }

  return (
    <>
      <h2>Nueva comunidad</h2>
      <CommunityForm onSubmit={handleSubmit} />
    </>
  );
}
