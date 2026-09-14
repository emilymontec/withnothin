package com.withnothin.app.feature.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.core.session.SessionManager
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.gotrue.gotrue
import io.github.jan.supabase.gotrue.providers.builtin.Email
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val supabase: SupabaseClient,
    sessionManager: SessionManager,
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    init {
        // Fuente única de verdad de "¿hay sesión?": SessionManager, que
        // SessionSync mantiene sincronizado con Supabase durante toda la
        // vida del proceso (login, refresh en segundo plano, logout, y
        // sesión restaurada de una apertura anterior de la app). Antes,
        // isAuthenticated solo se ponía en true dentro de runAuthAction,
        // así que un usuario con sesión válida seguía viendo la pantalla
        // de Login cada vez que abría la app — ver AUDITORIA-fase12.md.
        viewModelScope.launch {
            sessionManager.tokenFlow.collect { token ->
                _uiState.update { it.copy(isAuthenticated = token != null) }
            }
        }
    }

    fun onEmailChange(value: String) = _uiState.update { it.copy(email = value, errorMessage = null) }
    fun onPasswordChange(value: String) = _uiState.update { it.copy(password = value, errorMessage = null) }

    private fun validate(): String? {
        val state = _uiState.value
        val emailRegex = Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")
        return when {
            !emailRegex.matches(state.email) -> "Email inválido"
            state.password.length < 8 -> "La contraseña debe tener al menos 8 caracteres"
            else -> null
        }
    }

    fun signIn() = runAuthAction {
        supabase.gotrue.loginWith(Email) {
            email = _uiState.value.email
            password = _uiState.value.password
        }
    }

    fun signUp() = runAuthAction {
        supabase.gotrue.signUpWith(Email) {
            email = _uiState.value.email
            password = _uiState.value.password
        }
    }

    fun signOut() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                supabase.gotrue.logout()
                // isAuthenticated se actualiza solo, vía el collect de
                // sessionManager.tokenFlow en el init — no se pisa acá.
                _uiState.update { it.copy(isLoading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "Error al cerrar sesión") }
            }
        }
    }

    private fun runAuthAction(action: suspend () -> Unit) {
        val validationError = validate()
        if (validationError != null) {
            _uiState.update { it.copy(errorMessage = validationError) }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                action()
                // Igual que en signOut: isAuthenticated se actualiza solo
                // vía el collect de sessionManager.tokenFlow en el init.
                _uiState.update { it.copy(isLoading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "Error de autenticación") }
            }
        }
    }
}
