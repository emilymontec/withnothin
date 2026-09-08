'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProfile } from '@/features/profiles/hooks/use-profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfileOnboardingPage() {
  const router = useRouter();
  const createProfile = useCreateProfile();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createProfile.mutateAsync({ username, displayName });
    router.push('/feed');
  }

  return (
    <>
      <h2>Completa tu perfil</h2>
      <form onSubmit={handleSubmit}>
        <Input
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          pattern="[a-z0-9_]+"
          minLength={3}
          required
        />
        <Input
          id="displayName"
          label="Nombre para mostrar"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          error={createProfile.isError ? createProfile.error.message : undefined}
        />
        <Button type="submit" disabled={createProfile.isPending}>
          {createProfile.isPending ? 'Guardando...' : 'Continuar'}
        </Button>
      </form>
    </>
  );
}
