package com.withnothin.app.core.session

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

/**
 * Expone SessionManager.tokenFlow como "¿hay sesión?" para que
 * AppNavHost pueda reaccionar a un logout (o expiración de sesión)
 * ocurrido desde cualquier pantalla, no solo desde Login/Register.
 */
@HiltViewModel
class SessionObserverViewModel @Inject constructor(
    sessionManager: SessionManager,
) : ViewModel() {
    val isAuthenticated: StateFlow<Boolean> = sessionManager.tokenFlow
        .map { it != null }
        .stateIn(viewModelScope, SharingStarted.Eagerly, sessionManager.tokenFlow.value != null)
}
