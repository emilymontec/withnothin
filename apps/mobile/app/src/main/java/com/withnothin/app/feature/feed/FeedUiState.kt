package com.withnothin.app.feature.feed

import com.withnothin.app.data.remote.dto.PostDto

data class FeedUiState(
    val posts: List<PostDto> = emptyList(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
)
