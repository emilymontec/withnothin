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
)

@JsonClass(generateAdapter = true)
data class CreateProfileRequest(
    val username: String,
    @Json(name = "displayName") val displayName: String,
)
