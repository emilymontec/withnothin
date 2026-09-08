package com.withnothin.app.feature.search.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.feature.posts.ui.PostListItem
import com.withnothin.app.feature.search.SearchViewModel

@Composable
fun SearchScreen(
    onPostClick: (String) -> Unit,
    onProfileClick: (String) -> Unit,
    viewModel: SearchViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
        OutlinedTextField(
            value = state.query,
            onValueChange = viewModel::onQueryChange,
            label = { Text("Posts, personas o tecnologías") },
            modifier = Modifier.fillMaxWidth(),
        )

        if (state.isLoading) {
            CircularProgressIndicator()
        }

        state.errorMessage?.let { Text(it) }

        val results = state.results
        if (results != null) {
            LazyColumn {
                val profiles = results.profiles.orEmpty()
                if (profiles.isNotEmpty()) {
                    item { Text("Personas") }
                    items(profiles, key = { it.userId }) { profile ->
                        Text(
                            text = "${profile.displayName} · @${profile.username}",
                            modifier = Modifier.padding(vertical = 8.dp),
                        )
                    }
                }

                val technologies = results.technologies.orEmpty()
                if (technologies.isNotEmpty()) {
                    item { Text("Tecnologías") }
                    items(technologies, key = { it.id }) { tech ->
                        Text(text = tech.name, modifier = Modifier.padding(vertical = 4.dp))
                    }
                }

                val posts = results.posts.orEmpty()
                if (posts.isNotEmpty()) {
                    item { Text("Posts") }
                    items(posts, key = { it.id }) { post ->
                        PostListItem(
                            post = post,
                            onClick = { onPostClick(post.id) },
                            onAuthorClick = { onProfileClick(post.author.username) },
                        )
                    }
                }

                if (profiles.isEmpty() && technologies.isEmpty() && posts.isEmpty()) {
                    item { Text("Sin resultados para \"${state.query}\".") }
                }
            }
        }
    }
}
