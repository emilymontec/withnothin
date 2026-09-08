package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.MediaAssetResponse
import com.withnothin.app.data.remote.dto.RequestUploadUrlBody
import com.withnothin.app.data.remote.dto.UploadUrlResponse
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Path

interface MediaApi {

    @POST("media/upload-url")
    suspend fun requestUploadUrl(@Body body: RequestUploadUrlBody): UploadUrlResponse

    @POST("media/{id}/confirm")
    suspend fun confirmUpload(@Path("id") mediaId: String): MediaAssetResponse
}
