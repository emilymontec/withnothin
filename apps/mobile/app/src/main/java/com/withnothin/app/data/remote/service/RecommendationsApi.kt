package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.FollowUserDto
import com.withnothin.app.data.remote.dto.PostTechnologyRefDto
import retrofit2.http.GET

interface RecommendationsApi {

    @GET("recommendations/users")
    suspend fun getSuggestedUsers(): List<FollowUserDto>

    @GET("recommendations/technologies")
    suspend fun getSuggestedTechnologies(): List<PostTechnologyRefDto>
}
