package com.withnothin.app.feature.communities.ui

import androidx.compose.foundation.clickable
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
import com.withnothin.app.feature.communities.CommunitiesListViewModel

@Composable
fun CommunitiesListScreen(
    onCommunityClick: (String) -> Unit,
    onNewCommunityClick: () -> Unit,
    viewModel: CommunitiesListViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Button(onClick = onNewCommunityClick, modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)) {
            Text("Nueva comunidad")
        }

        when {
            state.isLoading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
            state.errorMessage != null -> Text(state.errorMessage!!)
            state.communities.isEmpty() -> Text("Todavía no hay comunidades.")
            else -> LazyColumn {
                items(state.communities, key = { it.id }) { community ->
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onCommunityClick(community.slug) }
                            .padding(vertical = 12.dp),
                    ) {
                        Text(text = community.name)
                        Text(text = "${community.membersCount} miembros")
                        community.description?.let { Text(text = it, maxLines = 2) }
                    }
                    Divider()
                }
            }
        }
    }
}
