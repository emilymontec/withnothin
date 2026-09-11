package com.withnothin.app.feature.communities.ui

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
import com.withnothin.app.feature.communities.CommunityDetailViewModel
import com.withnothin.app.feature.posts.ui.PostListItem

@Composable
fun CommunityDetailScreen(
    onPostClick: (String) -> Unit,
    onAuthorClick: (String) -> Unit,
    viewModel: CommunityDetailViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    if (state.isLoading) {
        CircularProgressIndicator()
        return
    }

    val community = state.community
    if (community == null) {
        Text(state.errorMessage ?: "No encontramos esta comunidad")
        return
    }

    Column(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
        Row(
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Column {
                Text(community.name)
                Text("${community.membersCount} miembros")
                community.description?.let { Text(it) }
            }
            if (!state.isOwner) {
                Button(onClick = viewModel::toggleMembership) {
                    Text(if (state.isMember) "Salir" else "Unirme")
                }
            }
        }

        Text("Posts", modifier = Modifier.padding(top = 16.dp))
        if (!state.isMember && !state.isOwner) {
            Text("Únete a la comunidad para publicar aquí.")
        }
        LazyColumn {
            items(state.posts, key = { it.id }) { post ->
                PostListItem(post = post, onClick = { onPostClick(post.id) }, onAuthorClick = { onAuthorClick(post.author.username) })
            }
        }
    }
}
