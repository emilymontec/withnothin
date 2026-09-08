package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.FollowUserDto
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface FollowsApi {

    @POST("users/{id}/follow")
    suspend fun follow(@Path("id") userId: String)

    @DELETE("users/{id}/follow")
    suspend fun unfollow(@Path("id") userId: String)

    @GET("users/{id}/followers")
    suspend fun getFollowers(@Path("id") userId: String): List<FollowUserDto>

    @GET("users/{id}/following")
    suspend fun getFollowing(@Path("id") userId: String): List<FollowUserDto>
}
