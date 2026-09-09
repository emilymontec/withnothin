package com.withnothin.app.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class AnswerDto(
    val id: String,
    val content: String,
    @Json(name = "isAccepted") val isAccepted: Boolean,
    @Json(name = "votesScore") val votesScore: Int,
    val author: PostAuthorDto,
    @Json(name = "createdAt") val createdAt: String,
)

@JsonClass(generateAdapter = true)
data class CreateAnswerBody(val content: String)

@JsonClass(generateAdapter = true)
data class CreateVoteBody(val value: Int) // 1 | -1
