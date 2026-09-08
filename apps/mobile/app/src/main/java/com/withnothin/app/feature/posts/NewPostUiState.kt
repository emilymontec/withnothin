package com.withnothin.app.feature.posts

data class NewPostUiState(
    val type: String = "BUILD",
    val content: String = "",
    val technologiesInput: String = "", // separado por comas — ver nota en NewPostScreen
    val tagsInput: String = "",
    val isSaving: Boolean = false,
    val errorMessage: String? = null,
    val createdPostId: String? = null,
)

val POST_TYPES = listOf("BUILD", "LEARN", "STUCK", "QUESTION", "IDEA", "SHOWCASE", "DISCOVER")
