package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.UserDto
import retrofit2.http.GET

interface UsersApi {

    @GET("users/me")
    suspend fun getMe(): UserDto
}
