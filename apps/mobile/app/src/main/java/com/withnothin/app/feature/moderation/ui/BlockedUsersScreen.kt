package com.withnothin.app.feature.moderation.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.feature.moderation.BlockedUsersViewModel

@Composable
fun BlockedUsersScreen(viewModel: BlockedUsersViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsState()

    when {
        state.isLoading -> CircularProgressIndicator()
        state.errorMessage != null -> Text(state.errorMessage!!)
        state.blocked.isEmpty() -> Text("No has bloqueado a nadie.", modifier = Modifier.padding(16.dp))
        else -> LazyColumn(modifier = Modifier.padding(16.dp)) {
            items(state.blocked, key = { it.userId }) { user ->
                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                ) {
                    Text("${user.displayName} · @${user.username}")
                    TextButton(onClick = { viewModel.unblock(user.userId) }) {
                        Text("Desbloquear")
                    }
                }
            }
        }
    }
}
