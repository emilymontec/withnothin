package com.withnothin.app.feature.posts.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.feature.posts.NewPostViewModel
import com.withnothin.app.feature.posts.POST_TYPES

@Composable
fun NewPostScreen(
    onPosted: (String) -> Unit,
    viewModel: NewPostViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(state.createdPostId) {
        state.createdPostId?.let(onPosted)
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Nuevo post")

        LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            items(POST_TYPES) { type ->
                FilterChip(
                    selected = state.type == type,
                    onClick = { viewModel.onTypeChange(type) },
                    label = { Text(type) },
                )
            }
        }

        OutlinedTextField(
            value = state.content,
            onValueChange = viewModel::onContentChange,
            label = { Text("¿Qué estás construyendo, aprendiendo o en qué te atascaste?") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 4,
        )

        // Simplificación consciente frente al selector de chips de la
        // web: en Android v1 se ingresan nombres separados por coma.
        // El backend resuelve cada nombre por find-or-create igual.
        OutlinedTextField(
            value = state.technologiesInput,
            onValueChange = viewModel::onTechnologiesChange,
            label = { Text("Tecnologías (separadas por coma)") },
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = state.tagsInput,
            onValueChange = viewModel::onTagsChange,
            label = { Text("Tags (separados por coma)") },
            modifier = Modifier.fillMaxWidth(),
        )

        state.errorMessage?.let { Text(it) }

        if (state.isSaving) {
            CircularProgressIndicator()
        } else {
            Row {
                Button(onClick = viewModel::submit, modifier = Modifier.fillMaxWidth()) {
                    Text("Publicar")
                }
            }
        }
    }
}
