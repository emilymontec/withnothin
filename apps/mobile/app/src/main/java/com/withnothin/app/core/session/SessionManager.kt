package com.withnothin.app.core.session

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.withnothin.app.core.network.TokenProvider
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Única fuente de verdad del token de sesión en el cliente Android.
 * Implementa TokenProvider (usado por AuthInterceptor) y expone un
 * StateFlow para que la UI (AuthViewModel) reaccione a login/logout.
 *
 * Se respalda en EncryptedSharedPreferences (androidx.security.crypto)
 * en vez de DataStore Preferences en texto plano: el access token es
 * un JWT que autentica toda la sesión del usuario contra la API, así
 * que se cifra en reposo con la solución estándar de Android — ver
 * AUDITORIA-fase12.md.
 */
@Singleton
class SessionManager @Inject constructor(
    context: Context,
) : TokenProvider {

    private val masterKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()

    private val encryptedPrefs = EncryptedSharedPreferences.create(
        context,
        "session_secure",
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
    )

    private val _tokenFlow = MutableStateFlow(encryptedPrefs.getString(TOKEN_KEY, null))
    val tokenFlow: StateFlow<String?> = _tokenFlow

    fun saveToken(token: String) {
        encryptedPrefs.edit().putString(TOKEN_KEY, token).apply()
        _tokenFlow.value = token
    }

    fun clear() {
        encryptedPrefs.edit().remove(TOKEN_KEY).apply()
        _tokenFlow.value = null
    }

    // Usado por AuthInterceptor (contexto síncrono de OkHttp).
    // EncryptedSharedPreferences es de por sí síncrono, así que ya no
    // hace falta el runBlocking que tenía la versión con DataStore.
    override fun getToken(): String? = _tokenFlow.value

    private companion object {
        const val TOKEN_KEY = "access_token"
    }
}
