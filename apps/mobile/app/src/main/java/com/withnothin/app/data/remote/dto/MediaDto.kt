package com.withnothin.app.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class RequestUploadUrlBody(
    val fileName: String,
    val mimeType: String,
    val sizeBytes: Long,
)

@JsonClass(generateAdapter = true)
data class UploadUrlResponse(
    val mediaId: String,
    @Json(name = "uploadUrl") val uploadUrl: String,
    val path: String,
    val token: String,
)

@JsonClass(generateAdapter = true)
data class MediaAssetResponse(
    val id: String,
    val url: String,
    val mimeType: String,
    val status: String,
)
