package com.withnothin.app.feature.communities.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.feature.communities.NewCommunityViewModel

@Composable
fun NewCommunityScreen(
    onCreated: (String) -> Unit,
    viewModel: NewCommunityViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(state.createdSlug) {
        state.createdSlug?.let(onCreated)
    }

    Column(
        modifier = Modifier.fillMaxWidth().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Nueva comunidad")

        OutlinedTextField(
            value = state.name,
            onValueChange = viewModel::onNameChange,
            label = { Text("Nombre") },
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = state.slug,
            onValueChange = viewModel::onSlugChange,
            label = { Text("Slug (URL)") },
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = state.description,
            onValueChange = viewModel::onDescriptionChange,
            label = { Text("Descripción") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 3,
        )

        state.errorMessage?.let { Text(it) }

        if (state.isSaving) {
            CircularProgressIndicator()
        } else {
            Button(onClick = viewModel::submit, modifier = Modifier.fillMaxWidth()) {
                Text("Crear comunidad")
            }
        }
    }
}
