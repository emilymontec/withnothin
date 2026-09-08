package com.withnothin.app.feature.projects

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.dto.CreateProjectBody
import com.withnothin.app.data.remote.service.ProjectsApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class NewProjectViewModel @Inject constructor(
    private val projectsApi: ProjectsApi,
) : ViewModel() {

    private val _uiState = MutableStateFlow(NewProjectUiState())
    val uiState: StateFlow<NewProjectUiState> = _uiState.asStateFlow()

    fun onNameChange(value: String) = _uiState.update { it.copy(name = value, errorMessage = null) }
    fun onDescriptionChange(value: String) = _uiState.update { it.copy(description = value) }
    fun onTechnologiesChange(value: String) = _uiState.update { it.copy(technologiesInput = value) }

    fun submit() {
        val state = _uiState.value
        if (state.name.trim().length < 2) {
            _uiState.update { it.copy(errorMessage = "El nombre del proyecto es muy corto") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, errorMessage = null) }
            try {
                val project = projectsApi.create(
                    CreateProjectBody(
                        name = state.name,
                        description = state.description.ifBlank { null },
                        technologies = state.technologiesInput
                            .split(",")
                            .map { it.trim() }
                            .filter { it.isNotEmpty() },
                    ),
                )
                _uiState.update { it.copy(isSaving = false, createdProjectId = project.id) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isSaving = false, errorMessage = e.message ?: "No pudimos crear el proyecto") }
            }
        }
    }
}
