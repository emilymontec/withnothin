package com.withnothin.app.feature.admin.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.withnothin.app.feature.admin.AdminViewModel

/**
 * La protección real vive en el backend (RolesGuard) — esta pantalla
 * solo debería enlazarse desde algún lugar visible solo para admins
 * (ej. un ítem de menú condicional en el perfil propio). No implementa
 * su propio chequeo de rol todavía; se agrega si hace falta.
 */
@Composable
fun AdminScreen(viewModel: AdminViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = viewModel::showUsers) { Text("Usuarios") }
            Button(onClick = viewModel::showReports) { Text("Reportes") }
        }

        state.errorMessage?.let { Text(it) }

        if (state.isLoading) {
            CircularProgressIndicator()
        } else if (state.showingReports) {
            LazyColumn {
                items(state.reports, key = { it.id }) { report ->
                    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)) {
                        Text("${report.targetType} · ${report.targetId}")
                        Text(report.reason)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            TextButton(onClick = { viewModel.updateReportStatus(report.id, "REVIEWED") }) {
                                Text("Marcar revisado")
                            }
                            TextButton(onClick = { viewModel.updateReportStatus(report.id, "DISMISSED") }) {
                                Text("Descartar")
                            }
                        }
                    }
                    Divider()
                }
            }
        } else {
            LazyColumn {
                items(state.users, key = { it.id }) { user ->
                    Row(
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    ) {
                        Column {
                            Text(user.email)
                            Text(if (user.isActive) "Activo" else "Desactivado")
                        }
                        TextButton(onClick = { viewModel.toggleUserActive(user.id, user.isActive) }) {
                            Text(if (user.isActive) "Desactivar" else "Reactivar")
                        }
                    }
                    Divider()
                }
            }
        }
    }
}
