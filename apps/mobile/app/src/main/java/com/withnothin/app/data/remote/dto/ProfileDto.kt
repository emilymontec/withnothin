package com.withnothin.app.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ProfileResponse(
    @Json(name = "userId") val userId: String,
    val username: String,
    @Json(name = "displayName") val displayName: String,
    val bio: String?,
    @Json(name = "avatarUrl") val avatarUrl: String?,
    val headline: String?,
    val location: String?,
    @Json(name = "followersCount") val followersCount: Int = 0,
    @Json(name = "followingCount") val followingCount: Int = 0,
    @Json(name = "isFollowedByCurrentUser") val isFollowedByCurrentUser: Boolean = false,
)

@JsonClass(generateAdapter = true)
data class CreateProfileRequest(
    val username: String,
    @Json(name = "displayName") val displayName: String,
)
