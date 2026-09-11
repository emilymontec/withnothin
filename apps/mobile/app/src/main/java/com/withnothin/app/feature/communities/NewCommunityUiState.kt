package com.withnothin.app.feature.communities

data class NewCommunityUiState(
    val name: String = "",
    val slug: String = "",
    val description: String = "",
    val isSaving: Boolean = false,
    val errorMessage: String? = null,
    val createdSlug: String? = null,
)
