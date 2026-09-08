package com.withnothin.app.feature.profile

import com.withnothin.app.data.remote.dto.FollowUserDto
import com.withnothin.app.data.remote.dto.PostDto
import com.withnothin.app.data.remote.dto.ProfileResponse

data class PublicProfileUiState(
    val profile: ProfileResponse? = null,
    val posts: List<PostDto> = emptyList(),
    val followers: List<FollowUserDto> = emptyList(),
    val isFollowing: Boolean = false,
    val isBlocked: Boolean = false,
    val isMuted: Boolean = false,
    val isCurrentUser: Boolean = false,
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
)
