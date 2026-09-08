package com.withnothin.app.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class NotificationDto(
    val id: String,
    val type: String,
    val payload: Map<String, Any?>?,
    @Json(name = "isRead") val isRead: Boolean,
    @Json(name = "createdAt") val createdAt: String,
)
