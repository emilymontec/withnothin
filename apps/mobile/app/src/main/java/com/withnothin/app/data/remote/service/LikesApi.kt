package com.withnothin.app.data.remote.service

import retrofit2.http.DELETE
import retrofit2.http.POST
import retrofit2.http.Path

interface LikesApi {

    @POST("posts/{postId}/likes")
    suspend fun like(@Path("postId") postId: String)

    @DELETE("posts/{postId}/likes")
    suspend fun unlike(@Path("postId") postId: String)
}
