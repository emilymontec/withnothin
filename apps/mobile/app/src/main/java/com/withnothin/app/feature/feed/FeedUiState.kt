package com.withnothin.app.feature.feed

import com.withnothin.app.data.remote.dto.PostDto

data class FeedUiState(
    val posts: List<PostDto> = emptyList(),
    val isLoading: Boolean = true,
    val isCurrentUserAdmin: Boolean = false,
    val errorMessage: String? = null,
)
