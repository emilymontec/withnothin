package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.CreatePostBody
import com.withnothin.app.data.remote.dto.PostDto
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface PostsApi {

    @POST("posts")
    suspend fun create(@Body body: CreatePostBody): PostDto

    @GET("posts")
    suspend fun findMany(
        @Query("cursor") cursor: String? = null,
        @Query("type") type: String? = null,
        @Query("technology") technology: String? = null,
    ): List<PostDto>

    @GET("posts/{id}")
    suspend fun findById(@Path("id") id: String): PostDto

    // Feed personalizado (requiere sesión) — separado de findMany, que es el listado público.
    @GET("feed")
    suspend fun getFeed(@Query("cursor") cursor: String? = null): List<PostDto>

    @DELETE("posts/{id}")
    suspend fun delete(@Path("id") id: String)
}
