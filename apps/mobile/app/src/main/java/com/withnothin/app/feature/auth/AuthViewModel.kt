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
    private val sessionManager: SessionManager,
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

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
                val token = supabase.gotrue.currentAccessTokenOrNull()
                if (token != null) {
                    sessionManager.saveToken(token)
                }
                _uiState.update { it.copy(isLoading = false, isAuthenticated = token != null) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "Error de autenticación") }
            }
        }
    }
}
