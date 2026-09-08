package com.withnothin.app.core.di

import com.withnothin.app.BuildConfig
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.GoTrue
import io.github.jan.supabase.storage.Storage
import javax.inject.Singleton

/**
 * Cliente de Supabase usado EXCLUSIVAMENTE para Auth (login/registro/
 * refresh de sesión), igual que en la web. Ningún repositorio de
 * negocio (posts, proyectos...) consulta Supabase directamente: eso
 * siempre pasa por la API vía Retrofit.
 */
@Module
@InstallIn(SingletonComponent::class)
object SupabaseModule {

    @Provides
    @Singleton
    fun provideSupabaseClient() = createSupabaseClient(
        supabaseUrl = BuildConfig.SUPABASE_URL,
        supabaseKey = BuildConfig.SUPABASE_ANON_KEY,
    ) {
        install(GoTrue)
        install(Storage)
    }
}
