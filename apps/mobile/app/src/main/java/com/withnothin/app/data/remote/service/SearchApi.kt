package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.SearchResultsDto
import retrofit2.http.GET
import retrofit2.http.Query

interface SearchApi {

    @GET("search")
    suspend fun search(@Query("q") q: String): SearchResultsDto
}
