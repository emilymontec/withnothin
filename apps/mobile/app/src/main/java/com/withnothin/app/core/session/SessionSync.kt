package com.withnothin.app.core.session

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.gotrue.SessionStatus
import io.github.jan.supabase.gotrue.gotrue
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Mantiene SessionManager (y por lo tanto AuthInterceptor, que es lo
 * único que las llamadas HTTP conocen) sincronizado con el estado real
 * de la sesión del SDK de Supabase — incluyendo refresh de tokens en
 * segundo plano y restauración de sesión al abrir la app.
 *
 * Antes de este fix, SessionManager solo se actualizaba una vez, a
 * mano, justo después de un login exitoso (ver AuthViewModel). Si
 * Supabase refrescaba el access token en segundo plano, o si la app se
 * reabría con una sesión ya guardada por el SDK, SessionManager (y por
 * lo tanto todas las llamadas a la API) seguía sin enterarse — la causa
 * más probable de que la sesión se "perdiera" al cerrar y reabrir la
 * app. Ver AUDITORIA-fase12.md.
 */
@Singleton
class SessionSync @Inject constructor(
    private val supabase: SupabaseClient,
    private val sessionManager: SessionManager,
) {
    /**
     * Se llama una sola vez, apenas arranca el proceso (ver App.kt).
     * El scope debe vivir tanto como la app — por eso se dispara desde
     * Application y no desde una Activity/ViewModel, que pueden
     * destruirse y recrearse durante la vida del proceso.
     */
    fun start(scope: CoroutineScope) {
        supabase.gotrue.sessionStatus
            .onEach { status ->
                when (status) {
                    is SessionStatus.Authenticated -> sessionManager.saveToken(status.session.accessToken)
                    is SessionStatus.NotAuthenticated -> sessionManager.clear()
                    // Estados transitorios (cargando la sesión guardada desde
                    // disco, o sin conexión) — no se toca el token todavía
                    // para no desloguear al usuario por un error de red.
                    is SessionStatus.LoadingFromStorage, is SessionStatus.NetworkError -> Unit
                }
            }
            .launchIn(scope)
    }
}
