package com.withnothin.app.feature.notifications

import com.withnothin.app.data.remote.dto.NotificationDto

data class NotificationsUiState(
    val notifications: List<NotificationDto> = emptyList(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
)
