package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.PostDto
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface SavesApi {

    @POST("posts/{postId}/saves")
    suspend fun save(@Path("postId") postId: String)

    @DELETE("posts/{postId}/saves")
    suspend fun unsave(@Path("postId") postId: String)

    @GET("saves")
    suspend fun findMine(@Query("cursor") cursor: String? = null): List<PostDto>
}
