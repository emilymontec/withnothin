package com.withnothin.app.feature.profile.userprofile.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
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
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.feature.posts.ui.PostListItem
import com.withnothin.app.feature.profile.PublicProfileViewModel

@Composable
fun PublicProfileScreen(
    onPostClick: (String) -> Unit,
    viewModel: PublicProfileViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    if (state.isLoading) {
        CircularProgressIndicator()
        return
    }

    val profile = state.profile
    if (profile == null) {
        Text(state.errorMessage ?: "No encontramos este perfil")
        return
    }

    Column(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
        Row(
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Column {
                Text(profile.displayName)
                Text("@${profile.username}")
                profile.headline?.let { Text(it) }
                Text("${state.followers.size} seguidores")
            }
            if (!state.isCurrentUser) {
                Button(onClick = viewModel::toggleFollow) {
                    Text(if (state.isFollowing) "Dejar de seguir" else "Seguir")
                }
            }
        }

        if (!state.isCurrentUser) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
                Button(onClick = viewModel::toggleMute) {
                    Text(if (state.isMuted) "Dejar de silenciar" else "Silenciar")
                }
                Button(onClick = viewModel::toggleBlock) {
                    Text(if (state.isBlocked) "Desbloquear" else "Bloquear")
                }
            }
        }

        Text("Posts", modifier = Modifier.padding(top = 16.dp))
        LazyColumn {
            items(state.posts, key = { it.id }) { post ->
                PostListItem(post = post, onClick = { onPostClick(post.id) }, onAuthorClick = {})
            }
        }
    }
}
