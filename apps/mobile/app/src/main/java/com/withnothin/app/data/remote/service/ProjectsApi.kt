package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.CreateProjectBody
import com.withnothin.app.data.remote.dto.ProjectDto
import com.withnothin.app.data.remote.dto.UpdateProjectBody
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ProjectsApi {

    @POST("projects")
    suspend fun create(@Body body: CreateProjectBody): ProjectDto

    @GET("projects")
    suspend fun findMany(
        @Query("cursor") cursor: String? = null,
        @Query("ownerId") ownerId: String? = null,
    ): List<ProjectDto>

    @GET("projects/{id}")
    suspend fun findById(@Path("id") id: String): ProjectDto

    @PATCH("projects/{id}")
    suspend fun update(@Path("id") id: String, @Body body: UpdateProjectBody): ProjectDto

    @DELETE("projects/{id}")
    suspend fun delete(@Path("id") id: String)
}
