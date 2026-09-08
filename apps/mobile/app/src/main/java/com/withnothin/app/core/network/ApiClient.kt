package com.withnothin.app.core.network

import com.withnothin.app.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory

/**
 * Punto único de configuración de red. Los servicios de cada feature
 * (AuthApi, PostsApi...) se crean a partir de esta misma instancia de
 * Retrofit — nunca se instancia Retrofit por feature.
 */
object ApiClient {

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BASIC
    }

    private fun okHttpClient(authInterceptor: AuthInterceptor) = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .build()

    fun create(authInterceptor: AuthInterceptor): Retrofit = Retrofit.Builder()
        .baseUrl(BuildConfig.API_BASE_URL)
        .client(okHttpClient(authInterceptor))
        .addConverterFactory(MoshiConverterFactory.create())
        .build()
}
