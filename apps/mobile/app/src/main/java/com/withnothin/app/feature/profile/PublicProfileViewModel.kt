package com.withnothin.app.feature.profile

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.service.FollowsApi
import com.withnothin.app.data.remote.service.ModerationApi
import com.withnothin.app.data.remote.service.PostsApi
import com.withnothin.app.data.remote.service.ProfilesApi
import com.withnothin.app.data.remote.service.UsersApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class PublicProfileViewModel @Inject constructor(
    private val profilesApi: ProfilesApi,
    private val postsApi: PostsApi,
    private val followsApi: FollowsApi,
    private val usersApi: UsersApi,
    private val moderationApi: ModerationApi,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {

    private val username: String = checkNotNull(savedStateHandle["username"])

    private val _uiState = MutableStateFlow(PublicProfileUiState())
    val uiState: StateFlow<PublicProfileUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, errorMessage = null) }
            try {
                val profile = profilesApi.getByUsername(username)
                val posts = postsApi.findMany() // TODO: filtrar por authorId cuando el endpoint lo soporte desde este cliente
                val followers = followsApi.getFollowers(profile.userId)
                val currentUser = runCatching { usersApi.getMe() }.getOrNull()

                _uiState.update {
                    it.copy(
                        profile = profile,
                        posts = posts.filter { post -> post.author.username == username },
                        followers = followers,
                        isFollowing = followers.any { f -> f.userId == currentUser?.id },
                        isCurrentUser = currentUser?.id == profile.userId,
                        isLoading = false,
                    )
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, errorMessage = e.message ?: "No pudimos cargar el perfil") }
            }
        }
    }

    fun toggleFollow() {
        val profile = _uiState.value.profile ?: return
        val wasFollowing = _uiState.value.isFollowing
        _uiState.update { it.copy(isFollowing = !wasFollowing) }

        viewModelScope.launch {
            try {
                if (wasFollowing) followsApi.unfollow(profile.userId) else followsApi.follow(profile.userId)
            } catch (e: Exception) {
                _uiState.update { it.copy(isFollowing = wasFollowing) }
            }
        }
    }

    fun toggleBlock() {
        val profile = _uiState.value.profile ?: return
        val wasBlocked = _uiState.value.isBlocked
        _uiState.update { it.copy(isBlocked = !wasBlocked) }

        viewModelScope.launch {
            try {
                if (wasBlocked) moderationApi.unblock(profile.userId) else moderationApi.block(profile.userId)
            } catch (e: Exception) {
                _uiState.update { it.copy(isBlocked = wasBlocked) }
            }
        }
    }

    fun toggleMute() {
        val profile = _uiState.value.profile ?: return
        val wasMuted = _uiState.value.isMuted
        _uiState.update { it.copy(isMuted = !wasMuted) }

        viewModelScope.launch {
            try {
                if (wasMuted) moderationApi.unmute(profile.userId) else moderationApi.mute(profile.userId)
            } catch (e: Exception) {
                _uiState.update { it.copy(isMuted = wasMuted) }
            }
        }
    }
}
