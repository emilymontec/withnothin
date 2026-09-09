package com.withnothin.app.feature.posts

import com.withnothin.app.data.remote.dto.AnswerDto
import com.withnothin.app.data.remote.dto.CommentDto
import com.withnothin.app.data.remote.dto.PostDto

data class PostDetailUiState(
    val post: PostDto? = null,
    val comments: List<CommentDto> = emptyList(),
    val answers: List<AnswerDto> = emptyList(),
    val newAnswerText: String = "",
    val isSubmittingAnswer: Boolean = false,
    val isLiked: Boolean = false, // estado local — la API no expone isLikedByCurrentUser todavía (ver roadmap)
    val isSaved: Boolean = false, // ídem para guardados
    val newCommentText: String = "",
    val isLoading: Boolean = true,
    val isSubmittingComment: Boolean = false,
    val isReportFormOpen: Boolean = false,
    val reportReason: String = "",
    val isSubmittingReport: Boolean = false,
    val reportSubmitted: Boolean = false,
    val isCurrentUserAuthor: Boolean = false,
    val errorMessage: String? = null,
)
