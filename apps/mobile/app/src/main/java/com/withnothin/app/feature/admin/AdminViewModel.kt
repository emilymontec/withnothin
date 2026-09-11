package com.withnothin.app.feature.admin

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.dto.UpdateReportStatusBody
import com.withnothin.app.data.remote.service.AdminApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class AdminViewModel @Inject constructor(
    private val adminApi: AdminApi,
) : ViewModel() {

    private val _uiState = MutableStateFlow(AdminUiState())
    val uiState: StateFlow<AdminUiState> = _uiState.asStateFlow()

    init {
        loadUsers()
    }

    fun showUsers() {
        _uiState.update { it.copy(showingReports = false) }
        loadUsers()
    }

    fun showReports() {
        _uiState.update { it.copy(showingReports = true) }
        loadReports()
    }

    private fun loadUsers() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val users = adminApi.getUsers()
                _uiState.update { it.copy(users = users, isLoading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "No pudimos cargar los usuarios") }
            }
        }
    }

    private fun loadReports() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val reports = adminApi.getReports("PENDING")
                _uiState.update { it.copy(reports = reports, isLoading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "No pudimos cargar los reportes") }
            }
        }
    }

    fun toggleUserActive(userId: String, isActive: Boolean) {
        viewModelScope.launch {
            try {
                if (isActive) adminApi.deactivateUser(userId) else adminApi.reactivateUser(userId)
                loadUsers()
            } catch (e: Exception) {
                _uiState.update { it.copy(errorMessage = e.message ?: "No pudimos actualizar el usuario") }
            }
        }
    }

    fun updateReportStatus(reportId: String, status: String) {
        viewModelScope.launch {
            try {
                adminApi.updateReportStatus(reportId, UpdateReportStatusBody(status))
                loadReports()
            } catch (e: Exception) {
                _uiState.update { it.copy(errorMessage = e.message ?: "No pudimos actualizar el reporte") }
            }
        }
    }
}
