package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.AdminReportDto
import com.withnothin.app.data.remote.dto.AdminUserDto
import com.withnothin.app.data.remote.dto.UpdateReportStatusBody
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.Path
import retrofit2.http.Query

interface AdminApi {

    @GET("admin/users")
    suspend fun getUsers(): List<AdminUserDto>

    @PATCH("admin/users/{id}/deactivate")
    suspend fun deactivateUser(@Path("id") id: String)

    @PATCH("admin/users/{id}/reactivate")
    suspend fun reactivateUser(@Path("id") id: String)

    @GET("admin/reports")
    suspend fun getReports(@Query("status") status: String? = null): List<AdminReportDto>

    @PATCH("admin/reports/{id}")
    suspend fun updateReportStatus(@Path("id") id: String, @Body body: UpdateReportStatusBody): AdminReportDto
}
