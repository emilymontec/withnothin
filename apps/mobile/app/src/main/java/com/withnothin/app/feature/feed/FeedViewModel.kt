package com.withnothin.app.feature.feed

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.service.PostsApi
import com.withnothin.app.data.remote.service.UsersApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class FeedViewModel @Inject constructor(
    private val postsApi: PostsApi,
    private val usersApi: UsersApi,
) : ViewModel() {

    private val _uiState = MutableStateFlow(FeedUiState())
    val uiState: StateFlow<FeedUiState> = _uiState.asStateFlow()

    init {
        loadFeed()
    }

    fun loadFeed() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val posts = postsApi.getFeed()
                val currentUser = runCatching { usersApi.getMe() }.getOrNull()
                _uiState.update {
                    it.copy(posts = posts, isCurrentUserAdmin = currentUser?.role == "ADMIN", isLoading = false)
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "No pudimos cargar tu feed") }
            }
        }
    }
}
