package com.withnothin.app.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class AdminUserDto(
    val id: String,
    val email: String,
    val role: String,
    val username: String?,
    @Json(name = "displayName") val displayName: String?,
    @Json(name = "isActive") val isActive: Boolean,
    @Json(name = "createdAt") val createdAt: String,
)

@JsonClass(generateAdapter = true)
data class AdminReportDto(
    val id: String,
    val targetType: String,
    val targetId: String,
    val reason: String,
    val status: String,
    @Json(name = "createdAt") val createdAt: String,
)

@JsonClass(generateAdapter = true)
data class UpdateReportStatusBody(val status: String)
