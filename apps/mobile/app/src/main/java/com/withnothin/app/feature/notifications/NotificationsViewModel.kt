package com.withnothin.app.feature.notifications

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.dto.NotificationDto
import com.withnothin.app.data.remote.service.NotificationsApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class NotificationsViewModel @Inject constructor(
    private val notificationsApi: NotificationsApi,
) : ViewModel() {

    private val _uiState = MutableStateFlow(NotificationsUiState())
    val uiState: StateFlow<NotificationsUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val notifications = notificationsApi.findMine()
                _uiState.update { it.copy(notifications = notifications, isLoading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "No pudimos cargar tus notificaciones") }
            }
        }
    }

    fun markRead(notification: NotificationDto) {
        if (notification.isRead) return
        viewModelScope.launch {
            try {
                notificationsApi.markRead(notification.id)
                _uiState.update { state ->
                    state.copy(
                        notifications = state.notifications.map {
                            if (it.id == notification.id) it.copy(isRead = true) else it
                        },
                    )
                }
            } catch (e: Exception) {
                // Silencioso: marcar como leída no es una acción crítica para el usuario.
            }
        }
    }

    fun markAllRead() {
        viewModelScope.launch {
            try {
                notificationsApi.markAllRead()
                _uiState.update { state -> state.copy(notifications = state.notifications.map { it.copy(isRead = true) }) }
            } catch (e: Exception) {
                // Silencioso, igual que markRead.
            }
        }
    }
}
