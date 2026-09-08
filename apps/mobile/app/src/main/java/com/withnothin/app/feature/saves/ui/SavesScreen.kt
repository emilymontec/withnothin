package com.withnothin.app.feature.saves.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.feature.posts.ui.PostListItem
import com.withnothin.app.feature.saves.SavesViewModel

@Composable
fun SavesScreen(
    onPostClick: (String) -> Unit,
    onAuthorClick: (String) -> Unit,
    viewModel: SavesViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    Box(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        when {
            state.isLoading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
            state.errorMessage != null -> Text(state.errorMessage!!)
            state.posts.isEmpty() -> Text("Todavía no guardaste ningún post.")
            else -> LazyColumn {
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
