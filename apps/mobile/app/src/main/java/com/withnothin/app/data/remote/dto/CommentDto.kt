package com.withnothin.app.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class CommentDto(
    val id: String,
    val content: String,
    @Json(name = "parentCommentId") val parentCommentId: String?,
    @Json(name = "isDeleted") val isDeleted: Boolean,
    val author: PostAuthorDto?,
    @Json(name = "createdAt") val createdAt: String,
)

@JsonClass(generateAdapter = true)
data class CreateCommentBody(
    val content: String,
    val parentCommentId: String? = null,
)
