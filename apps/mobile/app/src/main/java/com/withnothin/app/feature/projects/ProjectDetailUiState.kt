package com.withnothin.app.feature.projects

import com.withnothin.app.data.remote.dto.ProjectDto

data class ProjectDetailUiState(
    val project: ProjectDto? = null,
    val isCurrentUserOwner: Boolean = false,
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
)
