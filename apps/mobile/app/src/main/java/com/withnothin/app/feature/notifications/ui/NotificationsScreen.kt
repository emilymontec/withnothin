package com.withnothin.app.feature.notifications.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.data.remote.dto.NotificationDto
import com.withnothin.app.feature.notifications.NotificationsViewModel

private fun describe(notification: NotificationDto): String = when (notification.type) {
    "LIKE" -> "Le dio like a tu post"
    "COMMENT" -> "Comentó tu post"
    "FOLLOW" -> "Empezó a seguirte"
    else -> "Tienes una notificación nueva"
}

@Composable
fun NotificationsScreen(
    onNotificationClick: (NotificationDto) -> Unit,
    viewModel: NotificationsViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsState()

    Box(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        when {
            state.isLoading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
            state.errorMessage != null -> Text(state.errorMessage!!)
            state.notifications.isEmpty() -> Text("No tienes notificaciones todavía.")
            else -> Column {
                Row(
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Text("Notificaciones")
                    TextButton(onClick = viewModel::markAllRead) {
                        Text("Marcar todas como leídas")
                    }
                }
                LazyColumn {
                    items(state.notifications, key = { it.id }) { notification ->
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    viewModel.markRead(notification)
                                    onNotificationClick(notification)
                                }
                                .padding(vertical = 12.dp),
                        ) {
                            Text(
                                text = describe(notification),
                                fontWeight = if (notification.isRead) FontWeight.Normal else FontWeight.Bold,
                            )
                        }
                        Divider()
                    }
                }
            }
        }
    }
}
