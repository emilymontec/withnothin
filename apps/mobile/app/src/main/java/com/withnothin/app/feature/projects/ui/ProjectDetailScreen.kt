package com.withnothin.app.feature.projects.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.feature.projects.ProjectDetailViewModel

@Composable
fun ProjectDetailScreen(
    onOwnerClick: (String) -> Unit,
    viewModel: ProjectDetailViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    if (state.isLoading) {
        CircularProgressIndicator()
        return
    }

    val project = state.project
    if (project == null) {
        Text(state.errorMessage ?: "No encontramos este proyecto")
        return
    }

    Column(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
        Text(text = project.name)
        Text(
            text = "por @${project.owner.username}",
            modifier = Modifier.clickable { onOwnerClick(project.owner.username) },
        )

        if (project.status == "ARCHIVED") {
            Text("Archivado")
        }

        project.description?.let { Text(it, modifier = Modifier.padding(vertical = 8.dp)) }

        if (project.technologies.isNotEmpty()) {
            Text(project.technologies.joinToString(", ") { it.name })
        }

        Text("Miembros", modifier = Modifier.padding(top = 12.dp))
        project.members.forEach { member ->
            Text("@${member.username}${if (member.role == "OWNER") " · dueño" else ""}")
        }

        if (state.isCurrentUserOwner) {
            Button(onClick = viewModel::toggleArchived, modifier = Modifier.padding(top = 16.dp)) {
                Text(if (project.status == "ACTIVE") "Archivar" else "Reactivar")
            }
        }
    }
}
