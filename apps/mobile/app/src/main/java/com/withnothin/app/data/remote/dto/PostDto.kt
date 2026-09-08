package com.withnothin.app.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class PostAuthorDto(
    val id: String,
    val username: String,
    @Json(name = "displayName") val displayName: String,
    @Json(name = "avatarUrl") val avatarUrl: String?,
)

@JsonClass(generateAdapter = true)
data class PostTechnologyRefDto(val id: String, val name: String, val slug: String)

@JsonClass(generateAdapter = true)
data class PostTagRefDto(val id: String, val name: String, val slug: String)

@JsonClass(generateAdapter = true)
data class PostMediaRefDto(val id: String, val url: String)

@JsonClass(generateAdapter = true)
data class PostDto(
    val id: String,
    val type: String,
    val content: String,
    val status: String,
    val visibility: String,
    val author: PostAuthorDto,
    val technologies: List<PostTechnologyRefDto>,
    val tags: List<PostTagRefDto>,
    val media: List<PostMediaRefDto>,
    @Json(name = "likesCount") val likesCount: Int,
    @Json(name = "commentsCount") val commentsCount: Int,
    @Json(name = "createdAt") val createdAt: String,
)

@JsonClass(generateAdapter = true)
data class CreatePostBody(
    val type: String,
    val content: String,
    val visibility: String? = null,
    val technologies: List<String>? = null,
    val tags: List<String>? = null,
    val mediaIds: List<String>? = null,
)
