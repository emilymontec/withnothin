package com.withnothin.app.feature.posts

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.dto.CreatePostBody
import com.withnothin.app.data.remote.service.PostsApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class NewPostViewModel @Inject constructor(
    private val postsApi: PostsApi,
) : ViewModel() {

    private val _uiState = MutableStateFlow(NewPostUiState())
    val uiState: StateFlow<NewPostUiState> = _uiState.asStateFlow()

    fun onTypeChange(type: String) = _uiState.update { it.copy(type = type) }
    fun onContentChange(value: String) = _uiState.update { it.copy(content = value, errorMessage = null) }
    fun onTechnologiesChange(value: String) = _uiState.update { it.copy(technologiesInput = value) }
    fun onTagsChange(value: String) = _uiState.update { it.copy(tagsInput = value) }

    fun submit() {
        val state = _uiState.value
        if (state.content.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Escribe algo antes de publicar") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, errorMessage = null) }
            try {
                val post = postsApi.create(
                    CreatePostBody(
                        type = state.type,
                        content = state.content,
                        technologies = parseCommaSeparated(state.technologiesInput),
                        tags = parseCommaSeparated(state.tagsInput),
                    ),
                )
                _uiState.update { it.copy(isSaving = false, createdPostId = post.id) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isSaving = false, errorMessage = e.message ?: "No pudimos publicar tu post") }
            }
        }
    }

    private fun parseCommaSeparated(value: String): List<String> =
        value.split(",").map { it.trim() }.filter { it.isNotEmpty() }
}
