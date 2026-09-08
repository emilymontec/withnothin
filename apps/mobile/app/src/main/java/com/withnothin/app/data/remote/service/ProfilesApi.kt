package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.CreateProfileRequest
import com.withnothin.app.data.remote.dto.ProfileResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ProfilesApi {

    @GET("profiles/me")
    suspend fun getMyProfile(): ProfileResponse

    @POST("profiles/me")
    suspend fun createMyProfile(@Body body: CreateProfileRequest): ProfileResponse

    @GET("profiles/{username}")
    suspend fun getByUsername(@Path("username") username: String): ProfileResponse
}
