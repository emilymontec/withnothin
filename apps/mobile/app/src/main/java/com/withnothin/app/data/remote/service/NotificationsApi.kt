package com.withnothin.app.data.remote.service

import com.withnothin.app.data.remote.dto.NotificationDto
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.Path
import retrofit2.http.Query

interface NotificationsApi {

    @GET("notifications")
    suspend fun findMine(@Query("cursor") cursor: String? = null): List<NotificationDto>

    @GET("notifications/unread-count")
    suspend fun getUnreadCount(): Int

    @PATCH("notifications/{id}/read")
    suspend fun markRead(@Path("id") id: String)

    @PATCH("notifications/read-all")
    suspend fun markAllRead()
}
