package com.withnothin.app.feature.projects

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.dto.UpdateProjectBody
import com.withnothin.app.data.remote.service.ProjectsApi
import com.withnothin.app.data.remote.service.UsersApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProjectDetailViewModel @Inject constructor(
    private val projectsApi: ProjectsApi,
    private val usersApi: UsersApi,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {

    private val projectId: String = checkNotNull(savedStateHandle["projectId"])

    private val _uiState = MutableStateFlow(ProjectDetailUiState())
    val uiState: StateFlow<ProjectDetailUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val project = projectsApi.findById(projectId)
                val currentUser = runCatching { usersApi.getMe() }.getOrNull()
                _uiState.update {
                    it.copy(
                        project = project,
                        isCurrentUserOwner = currentUser?.id == project.owner.id,
                        isLoading = false,
                    )
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "No pudimos cargar el proyecto") }
            }
        }
    }

    fun toggleArchived() {
        val project = _uiState.value.project ?: return
        val newStatus = if (project.status == "ACTIVE") "ARCHIVED" else "ACTIVE"

        viewModelScope.launch {
            try {
                val updated = projectsApi.update(projectId, UpdateProjectBody(status = newStatus))
                _uiState.update { it.copy(project = updated) }
            } catch (e: Exception) {
                _uiState.update { it.copy(errorMessage = e.message ?: "No pudimos actualizar el proyecto") }
            }
        }
    }
}
