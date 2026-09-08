package com.withnothin.app.feature.posts.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.data.remote.dto.CommentDto
import com.withnothin.app.feature.posts.PostDetailViewModel

@Composable
fun PostDetailScreen(
    onAuthorClick: (String) -> Unit,
    viewModel: PostDetailViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    if (state.isLoading) {
        CircularProgressIndicator()
        return
    }

    val post = state.post
    if (post == null) {
        Text(state.errorMessage ?: "No encontramos este post")
        return
    }

    Column(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(text = post.type)
            Text(
                text = "@${post.author.username}",
                modifier = Modifier.clickable { onAuthorClick(post.author.username) },
            )
        }
        Text(text = post.content, modifier = Modifier.padding(vertical = 8.dp))

        Button(onClick = viewModel::toggleLike) {
            Text(if (state.isLiked) "♥ ${post.likesCount}" else "♡ ${post.likesCount}")
        }
        Button(onClick = viewModel::toggleSave) {
            Text(if (state.isSaved) "★ Guardado" else "☆ Guardar")
        }

        ReportSection(
            isOpen = state.isReportFormOpen,
            reason = state.reportReason,
            isSubmitting = state.isSubmittingReport,
            submitted = state.reportSubmitted,
            onToggle = viewModel::toggleReportForm,
            onReasonChange = viewModel::onReportReasonChange,
            onSubmit = viewModel::submitReport,
        )

        Divider(modifier = Modifier.padding(vertical = 12.dp))
        Text("Comentarios")

        OutlinedTextField(
            value = state.newCommentText,
            onValueChange = viewModel::onNewCommentChange,
            label = { Text("Escribe un comentario...") },
            modifier = Modifier.fillMaxWidth(),
        )
        Button(
            onClick = viewModel::submitComment,
            enabled = !state.isSubmittingComment,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text(if (state.isSubmittingComment) "Enviando..." else "Comentar")
        }

        LazyColumn {
            items(state.comments, key = { it.id }) { comment ->
                CommentRow(comment)
            }
        }
    }
}

@Composable
private fun CommentRow(comment: CommentDto) {
    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        if (comment.isDeleted) {
            Text("[eliminado]")
        } else {
            Text("@${comment.author?.username ?: ""}")
            Text(comment.content)
        }
    }
    Divider()
}

@Composable
private fun ReportSection(
    isOpen: Boolean,
    reason: String,
    isSubmitting: Boolean,
    submitted: Boolean,
    onToggle: () -> Unit,
    onReasonChange: (String) -> Unit,
    onSubmit: () -> Unit,
) {
    if (submitted) {
        Text("Gracias, lo revisaremos.")
        return
    }

    if (!isOpen) {
        TextButton(onClick = onToggle) { Text("Reportar") }
        return
    }

    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
        OutlinedTextField(
            value = reason,
            onValueChange = onReasonChange,
            label = { Text("¿Por qué quieres reportar esto?") },
            modifier = Modifier.fillMaxWidth(),
        )
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
            Button(onClick = onSubmit, enabled = !isSubmitting) {
                Text(if (isSubmitting) "Enviando..." else "Enviar reporte")
            }
            TextButton(onClick = onToggle) { Text("Cancelar") }
        }
    }
}
