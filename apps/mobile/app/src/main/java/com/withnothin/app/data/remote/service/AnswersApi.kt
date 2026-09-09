package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.AnswerDto
import com.withnothin.app.data.remote.dto.CreateAnswerBody
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path

interface AnswersApi {

    @POST("posts/{postId}/answers")
    suspend fun create(@Path("postId") postId: String, @Body body: CreateAnswerBody): AnswerDto

    @GET("posts/{postId}/answers")
    suspend fun findByPost(@Path("postId") postId: String): List<AnswerDto>

    @PATCH("posts/{postId}/answers/{answerId}/accept")
    suspend fun accept(@Path("postId") postId: String, @Path("answerId") answerId: String): AnswerDto
}
