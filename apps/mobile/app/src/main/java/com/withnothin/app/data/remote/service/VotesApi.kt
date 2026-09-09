package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.CreateVoteBody
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.POST
import retrofit2.http.Path

interface VotesApi {

    @POST("answers/{answerId}/votes")
    suspend fun vote(@Path("answerId") answerId: String, @Body body: CreateVoteBody)

    @DELETE("answers/{answerId}/votes")
    suspend fun unvote(@Path("answerId") answerId: String)
}
