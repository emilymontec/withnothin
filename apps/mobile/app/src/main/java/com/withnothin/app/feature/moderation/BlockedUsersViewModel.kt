package com.withnothin.app.feature.moderation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.service.ModerationApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class BlockedUsersViewModel @Inject constructor(
    private val moderationApi: ModerationApi,
) : ViewModel() {

    private val _uiState = MutableStateFlow(BlockedUsersUiState())
    val uiState: StateFlow<BlockedUsersUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val blocked = moderationApi.getBlocked()
                _uiState.update { it.copy(blocked = blocked, isLoading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "No pudimos cargar tus bloqueados") }
            }
        }
    }

    fun unblock(userId: String) {
        viewModelScope.launch {
            try {
                moderationApi.unblock(userId)
                _uiState.update { state -> state.copy(blocked = state.blocked.filter { it.userId != userId }) }
            } catch (e: Exception) {
                // Silencioso — el usuario puede reintentar desde la lista, que no cambió.
            }
        }
    }
}
