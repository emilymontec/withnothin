package com.withnothin.app.feature.projects

data class NewProjectUiState(
    val name: String = "",
    val description: String = "",
    val technologiesInput: String = "", // separado por comas — mismo criterio que NewPostScreen
    val isSaving: Boolean = false,
    val errorMessage: String? = null,
    val createdProjectId: String? = null,
)
