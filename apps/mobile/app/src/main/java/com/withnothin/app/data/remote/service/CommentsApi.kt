package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.CommentDto
import com.withnothin.app.data.remote.dto.CreateCommentBody
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface CommentsApi {

    @POST("posts/{postId}/comments")
    suspend fun create(@Path("postId") postId: String, @Body body: CreateCommentBody): CommentDto

    @GET("posts/{postId}/comments")
    suspend fun findByPost(@Path("postId") postId: String): List<CommentDto>

    @DELETE("comments/{id}")
    suspend fun delete(@Path("id") id: String)
}
