package com.withnothin.app.feature.feed.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.feature.feed.FeedViewModel
import com.withnothin.app.feature.posts.ui.PostListItem

@Composable
fun FeedScreen(
    onPostClick: (String) -> Unit,
    onAuthorClick: (String) -> Unit,
    onNewPostClick: () -> Unit,
    onSavesClick: () -> Unit,
    onNotificationsClick: () -> Unit,
    onSearchClick: () -> Unit,
    onBlockedUsersClick: () -> Unit,
    onProjectsClick: () -> Unit,
    viewModel: FeedViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = onSearchClick) { Text("Buscar") }
            Button(onClick = onSavesClick) { Text("Guardados") }
            Button(onClick = onNotificationsClick) { Text("Notificaciones") }
            Button(onClick = onBlockedUsersClick) { Text("Bloqueados") }
            Button(onClick = onProjectsClick) { Text("Proyectos") }
        }
        Button(onClick = onNewPostClick, modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
            Text("Nuevo post")
        }

        when {
            state.isLoading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
            state.errorMessage != null -> Text(state.errorMessage!!)
            state.posts.isEmpty() -> Text("Tu feed está vacío. Sigue a alguien o publica algo.")
            else -> LazyColumn(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                items(state.posts, key = { it.id }) { post ->
                    PostListItem(
                        post = post,
                        onClick = { onPostClick(post.id) },
                        onAuthorClick = { onAuthorClick(post.author.username) },
                    )
                }
            }
        }
    }
}
