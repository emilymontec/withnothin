package com.withnothin.app.feature.profile

data class ProfileOnboardingUiState(
    val username: String = "",
    val displayName: String = "",
    val isSaving: Boolean = false,
    val errorMessage: String? = null,
    val isCompleted: Boolean = false,
)
