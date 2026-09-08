import type { ApiErrorResponse } from '@withnothin/shared-types';
import { useSessionStore } from '@/stores/session-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly body: ApiErrorResponse,
  ) {
    super(body.message);
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

/**
 * Único punto de entrada para llamar a la API desde la web.
 * Ningún `fetch` a la API debería hacerse fuera de este cliente
 * (o de los servicios de cada feature que lo envuelven).
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  // Si no se pasa un token explícito, se toma el de la sesión activa.
  const { token = useSessionStore.getState().token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json()) as ApiErrorResponse;
    throw new ApiError(response.status, errorBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
