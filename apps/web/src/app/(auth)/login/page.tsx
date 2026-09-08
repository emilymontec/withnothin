'use client';

import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth-service';
import { AuthForm } from '@/features/auth/components/auth-form';

export default function LoginPage() {
  const router = useRouter();

  async function handleLogin(values: { email: string; password: string }) {
    await authService.signIn(values);
    router.push('/feed');
  }

  return (
    <>
      <h2>Bienvenido de vuelta</h2>
      <AuthForm mode="login" onSubmit={handleLogin} />
      <p>
        ¿No tienes cuenta? <a href="/register">Créala</a>
      </p>
    </>
  );
}
