package com.withnothin.app.feature.projects.ui

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
import com.withnothin.app.feature.projects.NewProjectViewModel

@Composable
fun NewProjectScreen(
    onCreated: (String) -> Unit,
    viewModel: NewProjectViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(state.createdProjectId) {
        state.createdProjectId?.let(onCreated)
    }

    Column(
        modifier = Modifier.fillMaxWidth().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Nuevo proyecto")

        OutlinedTextField(
            value = state.name,
            onValueChange = viewModel::onNameChange,
            label = { Text("Nombre del proyecto") },
            modifier = Modifier.fillMaxWidth(),
        )
        OutlinedTextField(
            value = state.description,
            onValueChange = viewModel::onDescriptionChange,
            label = { Text("Descripción") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 3,
        )
        OutlinedTextField(
            value = state.technologiesInput,
            onValueChange = viewModel::onTechnologiesChange,
            label = { Text("Tecnologías (separadas por coma)") },
            modifier = Modifier.fillMaxWidth(),
        )

        state.errorMessage?.let { Text(it) }

        if (state.isSaving) {
            CircularProgressIndicator()
        } else {
            Button(onClick = viewModel::submit, modifier = Modifier.fillMaxWidth()) {
                Text("Crear proyecto")
            }
        }
    }
}
