package com.withnothin.app.feature.communities

import com.withnothin.app.data.remote.dto.CommunityDto

data class CommunitiesListUiState(
    val communities: List<CommunityDto> = emptyList(),
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
)
