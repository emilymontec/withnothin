package com.withnothin.app.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class CommunityOwnerDto(
    val id: String,
    val username: String,
    @Json(name = "displayName") val displayName: String,
)

@JsonClass(generateAdapter = true)
data class CommunityDto(
    val id: String,
    val slug: String,
    val name: String,
    val description: String?,
    val owner: CommunityOwnerDto,
    @Json(name = "membersCount") val membersCount: Int,
    @Json(name = "createdAt") val createdAt: String,
)

@JsonClass(generateAdapter = true)
data class CreateCommunityBody(
    val name: String,
    val slug: String,
    val description: String? = null,
)
