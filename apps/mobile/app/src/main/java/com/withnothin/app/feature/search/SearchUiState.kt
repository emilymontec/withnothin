package com.withnothin.app.feature.search

import com.withnothin.app.data.remote.dto.SearchResultsDto

data class SearchUiState(
    val query: String = "",
    val results: SearchResultsDto? = null,
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
)
