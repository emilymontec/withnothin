'use client';

import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth-service';
import { AuthForm } from '@/features/auth/components/auth-form';

export default function RegisterPage() {
  const router = useRouter();

  async function handleRegister(values: { email: string; password: string }) {
    await authService.signUp(values);
    // El primer request autenticado a la API aprovisiona al usuario (ver AuthGuard).
    // Después de registrarse, se lo lleva a completar su perfil (username, display name).
    router.push('/onboarding/profile');
  }

  return (
    <>
      <h2>Crea tu cuenta</h2>
      <AuthForm mode="register" onSubmit={handleRegister} />
      <p>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </>
  );
}
