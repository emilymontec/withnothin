package com.withnothin.app.core.session

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.withnothin.app.core.network.TokenProvider
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.runBlocking
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore by preferencesDataStore(name = "session")

/**
 * Única fuente de verdad del token de sesión en el cliente Android.
 * Implementa TokenProvider (usado por AuthInterceptor) y expone un
 * Flow para que la UI (AuthViewModel) reaccione a login/logout.
 */
@Singleton
class SessionManager @Inject constructor(
    private val context: Context,
) : TokenProvider {

    private val tokenKey = stringPreferencesKey("access_token")

    val tokenFlow: Flow<String?> = context.dataStore.data.map { it[tokenKey] }

    suspend fun saveToken(token: String) {
        context.dataStore.edit { it[tokenKey] = token }
    }

    suspend fun clear() {
        context.dataStore.edit { it.remove(tokenKey) }
    }

    // Usado por AuthInterceptor (contexto síncrono de OkHttp).
    override fun getToken(): String? = runBlocking { tokenFlow.first() }
}
