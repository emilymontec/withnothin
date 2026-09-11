package com.withnothin.app.feature.communities

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.dto.CreateCommunityBody
import com.withnothin.app.data.remote.service.CommunitiesApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

private fun slugify(value: String): String =
    value.lowercase().trim().replace(Regex("[^a-z0-9]+"), "-").trim('-')

@HiltViewModel
class NewCommunityViewModel @Inject constructor(
    private val communitiesApi: CommunitiesApi,
) : ViewModel() {

    private val _uiState = MutableStateFlow(NewCommunityUiState())
    val uiState: StateFlow<NewCommunityUiState> = _uiState.asStateFlow()

    fun onNameChange(value: String) =
        _uiState.update { it.copy(name = value, slug = slugify(value), errorMessage = null) }

    fun onSlugChange(value: String) = _uiState.update { it.copy(slug = slugify(value)) }
    fun onDescriptionChange(value: String) = _uiState.update { it.copy(description = value) }

    fun submit() {
        val state = _uiState.value
        if (state.name.trim().length < 2 || state.slug.trim().length < 3) {
            _uiState.update { it.copy(errorMessage = "Completa nombre y slug válidos") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, errorMessage = null) }
            try {
                val community = communitiesApi.create(
                    CreateCommunityBody(
                        name = state.name,
                        slug = state.slug,
                        description = state.description.ifBlank { null },
                    ),
                )
                _uiState.update { it.copy(isSaving = false, createdSlug = community.slug) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isSaving = false, errorMessage = e.message ?: "No pudimos crear la comunidad") }
            }
        }
    }
}
