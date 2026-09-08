package com.withnothin.app.feature.projects

import com.withnothin.app.data.remote.dto.ProjectDto

data class ProjectsListUiState(
    val projects: List<ProjectDto> = emptyList(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
)
