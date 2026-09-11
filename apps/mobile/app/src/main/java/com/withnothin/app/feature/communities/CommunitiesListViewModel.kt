package com.withnothin.app.feature.communities

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.service.CommunitiesApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CommunitiesListViewModel @Inject constructor(
    private val communitiesApi: CommunitiesApi,
) : ViewModel() {

    private val _uiState = MutableStateFlow(CommunitiesListUiState())
    val uiState: StateFlow<CommunitiesListUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val communities = communitiesApi.findMany()
                _uiState.update { it.copy(communities = communities, isLoading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "No pudimos cargar las comunidades") }
            }
        }
    }
}
