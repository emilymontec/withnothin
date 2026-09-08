package com.withnothin.app.feature.saves

import com.withnothin.app.data.remote.dto.PostDto

data class SavesUiState(
    val posts: List<PostDto> = emptyList(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
)
