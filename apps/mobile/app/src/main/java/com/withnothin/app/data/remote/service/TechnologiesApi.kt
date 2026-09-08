package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.TechnologyDto
import retrofit2.http.GET
import retrofit2.http.Query

interface TechnologiesApi {

    @GET("technologies")
    suspend fun search(@Query("search") search: String? = null): List<TechnologyDto>
}
