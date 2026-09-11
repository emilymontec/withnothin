package com.withnothin.app.feature.communities

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.service.CommunitiesApi
import com.withnothin.app.data.remote.service.UsersApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CommunityDetailViewModel @Inject constructor(
    private val communitiesApi: CommunitiesApi,
    private val usersApi: UsersApi,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {

    private val slug: String = checkNotNull(savedStateHandle["slug"])

    private val _uiState = MutableStateFlow(CommunityDetailUiState())
    val uiState: StateFlow<CommunityDetailUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val community = communitiesApi.findBySlug(slug)
                val members = communitiesApi.getMembers(community.id)
                val posts = communitiesApi.getCommunityPosts(community.id)
                val currentUser = runCatching { usersApi.getMe() }.getOrNull()

                _uiState.update {
                    it.copy(
                        community = community,
                        members = members,
                        posts = posts,
                        isMember = members.any { m -> m.userId == currentUser?.id },
                        isOwner = currentUser?.id == community.owner.id,
                        isLoading = false,
                    )
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "No pudimos cargar la comunidad") }
            }
        }
    }

    fun toggleMembership() {
        val community = _uiState.value.community ?: return
        val wasMember = _uiState.value.isMember
        _uiState.update { it.copy(isMember = !wasMember) }

        viewModelScope.launch {
            try {
                if (wasMember) communitiesApi.leave(community.id) else communitiesApi.join(community.id)
            } catch (e: Exception) {
                _uiState.update { it.copy(isMember = wasMember) }
            }
        }
    }
}
