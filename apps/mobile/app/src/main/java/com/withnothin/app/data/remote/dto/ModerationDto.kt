package com.withnothin.app.data.remote.dto

import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class CreateReportBody(
    val targetType: String, // "POST" | "COMMENT" | "USER"
    val targetId: String,
    val reason: String,
)

@JsonClass(generateAdapter = true)
data class ReportResponse(val id: String, val status: String)
