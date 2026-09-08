package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.CreateReportBody
import com.withnothin.app.data.remote.dto.FollowUserDto
import com.withnothin.app.data.remote.dto.ReportResponse
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ModerationApi {

    @POST("users/{id}/block")
    suspend fun block(@Path("id") userId: String)

    @DELETE("users/{id}/block")
    suspend fun unblock(@Path("id") userId: String)

    @GET("blocks")
    suspend fun getBlocked(): List<FollowUserDto>

    @POST("users/{id}/mute")
    suspend fun mute(@Path("id") userId: String)

    @DELETE("users/{id}/mute")
    suspend fun unmute(@Path("id") userId: String)

    @GET("mutes")
    suspend fun getMuted(): List<FollowUserDto>

    @POST("reports")
    suspend fun report(@Body body: CreateReportBody): ReportResponse
}
