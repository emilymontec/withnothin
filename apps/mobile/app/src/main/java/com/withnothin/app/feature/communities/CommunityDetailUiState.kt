package com.withnothin.app.feature.communities

import com.withnothin.app.data.remote.dto.CommunityDto
import com.withnothin.app.data.remote.dto.FollowUserDto
import com.withnothin.app.data.remote.dto.PostDto

data class CommunityDetailUiState(
    val community: CommunityDto? = null,
    val members: List<FollowUserDto> = emptyList(),
    val posts: List<PostDto> = emptyList(),
    val isMember: Boolean = false,
    val isOwner: Boolean = false,
    val isLoading: Boolean = true,
    val errorMessage: String? = null,
)
