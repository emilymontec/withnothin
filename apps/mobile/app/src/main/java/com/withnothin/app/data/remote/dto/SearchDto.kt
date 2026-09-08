package com.withnothin.app.data.remote.dto

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class SearchProfileResultDto(
    val userId: String,
    val username: String,
    val displayName: String,
    val avatarUrl: String?,
)

@JsonClass(generateAdapter = true)
data class SearchTechnologyResultDto(val id: String, val name: String, val slug: String)

@JsonClass(generateAdapter = true)
data class SearchResultsDto(
    val posts: List<PostDto>?,
    val profiles: List<SearchProfileResultDto>?,
    val technologies: List<SearchTechnologyResultDto>?,
)
