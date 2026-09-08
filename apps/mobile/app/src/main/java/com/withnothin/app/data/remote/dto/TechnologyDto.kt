package com.withnothin.app.data.remote.dto

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class TechnologyDto(
    val id: String,
    val name: String,
    val slug: String,
    val category: String?,
)
