package com.withnothin.app.feature.projects.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.feature.projects.ProjectsListViewModel

@Composable
fun ProjectsListScreen(
    onProjectClick: (String) -> Unit,
    onNewProjectClick: () -> Unit,
    viewModel: ProjectsListViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Button(onClick = onNewProjectClick, modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)) {
            Text("Nuevo proyecto")
        }

        when {
            state.isLoading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
            state.errorMessage != null -> Text(state.errorMessage!!)
            state.projects.isEmpty() -> Text("Todavía no hay proyectos publicados.")
            else -> LazyColumn(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                items(state.projects, key = { it.id }) { project ->
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onProjectClick(project.id) }
                            .padding(vertical = 12.dp),
                    ) {
                        Text(text = project.name)
                        Text(text = "por @${project.owner.username}")
                        project.description?.let { Text(text = it, maxLines = 2) }
                    }
                    Divider()
                }
            }
        }
    }
}
