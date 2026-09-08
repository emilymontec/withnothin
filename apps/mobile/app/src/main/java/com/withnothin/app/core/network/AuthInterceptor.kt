package com.withnothin.app.core.network

import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject

/**
 * Adjunta el token de sesión (emitido por Supabase Auth) a cada request
 * saliente. La fuente del token real (DataStore/almacenamiento seguro)
 * se implementa en la Fase 2 junto con el módulo de auth.
 */
class AuthInterceptor @Inject constructor(
    private val tokenProvider: TokenProvider,
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val original = chain.request()
        val token = tokenProvider.getToken()

        val request = if (token != null) {
            original.newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        } else {
            original
        }

        return chain.proceed(request)
    }
}

/**
 * Abstracción sobre el origen del token de sesión. Se implementa
 * concretamente en la Fase 2 (ej. respaldado por DataStore cifrado).
 */
interface TokenProvider {
    fun getToken(): String?
}
