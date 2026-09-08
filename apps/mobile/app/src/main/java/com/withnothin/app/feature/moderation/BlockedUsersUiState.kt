package com.withnothin.app.feature.moderation

import com.withnothin.app.data.remote.dto.FollowUserDto

data class BlockedUsersUiState(
    val blocked: List<FollowUserDto> = emptyList(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
)
