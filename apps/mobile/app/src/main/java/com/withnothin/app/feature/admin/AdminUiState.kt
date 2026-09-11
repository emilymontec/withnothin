package com.withnothin.app.feature.admin

import com.withnothin.app.data.remote.dto.AdminReportDto
import com.withnothin.app.data.remote.dto.AdminUserDto

data class AdminUiState(
    val users: List<AdminUserDto> = emptyList(),
    val reports: List<AdminReportDto> = emptyList(),
    val showingReports: Boolean = false,
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
)
