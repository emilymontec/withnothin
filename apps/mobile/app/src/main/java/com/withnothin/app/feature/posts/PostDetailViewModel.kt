package com.withnothin.app.feature.posts

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.dto.CreateCommentBody
import com.withnothin.app.data.remote.dto.CreateReportBody
import com.withnothin.app.data.remote.service.CommentsApi
import com.withnothin.app.data.remote.service.LikesApi
import com.withnothin.app.data.remote.service.ModerationApi
import com.withnothin.app.data.remote.service.PostsApi
import com.withnothin.app.data.remote.service.SavesApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class PostDetailViewModel @Inject constructor(
    private val postsApi: PostsApi,
    private val commentsApi: CommentsApi,
    private val likesApi: LikesApi,
    private val savesApi: SavesApi,
    private val moderationApi: ModerationApi,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {

    private val postId: String = checkNotNull(savedStateHandle["postId"])

    private val _uiState = MutableStateFlow(PostDetailUiState())
    val uiState: StateFlow<PostDetailUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val post = postsApi.findById(postId)
                val comments = commentsApi.findByPost(postId)
                _uiState.update { it.copy(post = post, comments = comments, isLoading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "No pudimos cargar el post") }
            }
        }
    }

    fun toggleLike() {
        val wasLiked = _uiState.value.isLiked
        _uiState.update { it.copy(isLiked = !wasLiked) } // optimista, igual que en la web
        viewModelScope.launch {
            try {
                if (wasLiked) likesApi.unlike(postId) else likesApi.like(postId)
            } catch (e: Exception) {
                _uiState.update { it.copy(isLiked = wasLiked) } // revertir si falla
            }
        }
    }

    fun onNewCommentChange(value: String) = _uiState.update { it.copy(newCommentText = value) }

    fun toggleSave() {
        val wasSaved = _uiState.value.isSaved
        _uiState.update { it.copy(isSaved = !wasSaved) }
        viewModelScope.launch {
            try {
                if (wasSaved) savesApi.unsave(postId) else savesApi.save(postId)
            } catch (e: Exception) {
                _uiState.update { it.copy(isSaved = wasSaved) }
            }
        }
    }

    fun submitComment() {
        val content = _uiState.value.newCommentText
        if (content.isBlank()) return

        viewModelScope.launch {
            _uiState.update { it.copy(isSubmittingComment = true) }
            try {
                commentsApi.create(postId, CreateCommentBody(content = content))
                val comments = commentsApi.findByPost(postId)
                _uiState.update { it.copy(comments = comments, newCommentText = "", isSubmittingComment = false) }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(isSubmittingComment = false, errorMessage = e.message ?: "No pudimos enviar tu comentario")
                }
            }
        }
    }

    fun toggleReportForm() = _uiState.update { it.copy(isReportFormOpen = !it.isReportFormOpen, reportSubmitted = false) }

    fun onReportReasonChange(value: String) = _uiState.update { it.copy(reportReason = value) }

    fun submitReport() {
        val reason = _uiState.value.reportReason
        if (reason.trim().length < 3) return

        viewModelScope.launch {
            _uiState.update { it.copy(isSubmittingReport = true) }
            try {
                moderationApi.report(CreateReportBody(targetType = "POST", targetId = postId, reason = reason))
                _uiState.update {
                    it.copy(
                        isSubmittingReport = false,
                        isReportFormOpen = false,
                        reportReason = "",
                        reportSubmitted = true,
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(isSubmittingReport = false, errorMessage = e.message ?: "No pudimos enviar el reporte")
                }
            }
        }
    }
}
