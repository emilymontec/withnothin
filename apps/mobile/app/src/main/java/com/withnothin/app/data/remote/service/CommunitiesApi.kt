package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.CommunityDto
import com.withnothin.app.data.remote.dto.CreateCommunityBody
import com.withnothin.app.data.remote.dto.FollowUserDto
import com.withnothin.app.data.remote.dto.PostDto
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface CommunitiesApi {

    @POST("communities")
    suspend fun create(@Body body: CreateCommunityBody): CommunityDto

    @GET("communities")
    suspend fun findMany(@Query("cursor") cursor: String? = null): List<CommunityDto>

    @GET("communities/slug/{slug}")
    suspend fun findBySlug(@Path("slug") slug: String): CommunityDto

    @POST("communities/{id}/join")
    suspend fun join(@Path("id") id: String)

    @DELETE("communities/{id}/join")
    suspend fun leave(@Path("id") id: String)

    @GET("communities/{id}/members")
    suspend fun getMembers(@Path("id") id: String): List<FollowUserDto>

    @GET("posts")
    suspend fun getCommunityPosts(@Query("communityId") communityId: String): List<PostDto>
}
