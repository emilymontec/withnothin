package com.withnothin.app.core.di

import android.content.Context
import com.withnothin.app.core.network.ApiClient
import com.withnothin.app.core.network.AuthInterceptor
import com.withnothin.app.core.network.TokenProvider
import com.withnothin.app.core.session.SessionManager
import com.withnothin.app.data.remote.service.AnswersApi
import com.withnothin.app.data.remote.service.AdminApi
import com.withnothin.app.data.remote.service.CommentsApi
import com.withnothin.app.data.remote.service.CommunitiesApi
import com.withnothin.app.data.remote.service.FollowsApi
import com.withnothin.app.data.remote.service.LikesApi
import com.withnothin.app.data.remote.service.MediaApi
import com.withnothin.app.data.remote.service.ModerationApi
import com.withnothin.app.data.remote.service.NotificationsApi
import com.withnothin.app.data.remote.service.PostsApi
import com.withnothin.app.data.remote.service.ProfilesApi
import com.withnothin.app.data.remote.service.ProjectsApi
import com.withnothin.app.data.remote.service.RecommendationsApi
import com.withnothin.app.data.remote.service.SavesApi
import com.withnothin.app.data.remote.service.SearchApi
import com.withnothin.app.data.remote.service.TechnologiesApi
import com.withnothin.app.data.remote.service.UsersApi
import com.withnothin.app.data.remote.service.VotesApi
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideSessionManager(@ApplicationContext context: Context): SessionManager =
        SessionManager(context)

    @Provides
    @Singleton
    fun provideTokenProvider(sessionManager: SessionManager): TokenProvider = sessionManager

    @Provides
    @Singleton
    fun provideAuthInterceptor(tokenProvider: TokenProvider): AuthInterceptor =
        AuthInterceptor(tokenProvider)

    @Provides
    @Singleton
    fun provideRetrofit(authInterceptor: AuthInterceptor): Retrofit =
        ApiClient.create(authInterceptor)

    @Provides
    @Singleton
    fun provideProfilesApi(retrofit: Retrofit): ProfilesApi =
        retrofit.create(ProfilesApi::class.java)

    @Provides
    @Singleton
    fun provideTechnologiesApi(retrofit: Retrofit): TechnologiesApi =
        retrofit.create(TechnologiesApi::class.java)

    @Provides
    @Singleton
    fun provideMediaApi(retrofit: Retrofit): MediaApi =
        retrofit.create(MediaApi::class.java)

    @Provides
    @Singleton
    fun providePostsApi(retrofit: Retrofit): PostsApi =
        retrofit.create(PostsApi::class.java)

    @Provides
    @Singleton
    fun provideCommentsApi(retrofit: Retrofit): CommentsApi =
        retrofit.create(CommentsApi::class.java)

    @Provides
    @Singleton
    fun provideLikesApi(retrofit: Retrofit): LikesApi =
        retrofit.create(LikesApi::class.java)

    @Provides
    @Singleton
    fun provideFollowsApi(retrofit: Retrofit): FollowsApi =
        retrofit.create(FollowsApi::class.java)

    @Provides
    @Singleton
    fun provideUsersApi(retrofit: Retrofit): UsersApi =
        retrofit.create(UsersApi::class.java)

    @Provides
    @Singleton
    fun provideSavesApi(retrofit: Retrofit): SavesApi =
        retrofit.create(SavesApi::class.java)

    @Provides
    @Singleton
    fun provideNotificationsApi(retrofit: Retrofit): NotificationsApi =
        retrofit.create(NotificationsApi::class.java)

    @Provides
    @Singleton
    fun provideSearchApi(retrofit: Retrofit): SearchApi =
        retrofit.create(SearchApi::class.java)

    @Provides
    @Singleton
    fun provideModerationApi(retrofit: Retrofit): ModerationApi =
        retrofit.create(ModerationApi::class.java)

    @Provides
    @Singleton
    fun provideProjectsApi(retrofit: Retrofit): ProjectsApi =
        retrofit.create(ProjectsApi::class.java)

    @Provides
    @Singleton
    fun provideAnswersApi(retrofit: Retrofit): AnswersApi =
        retrofit.create(AnswersApi::class.java)

    @Provides
    @Singleton
    fun provideVotesApi(retrofit: Retrofit): VotesApi =
        retrofit.create(VotesApi::class.java)

    @Provides
    @Singleton
    fun provideCommunitiesApi(retrofit: Retrofit): CommunitiesApi =
        retrofit.create(CommunitiesApi::class.java)

    @Provides
    @Singleton
    fun provideAdminApi(retrofit: Retrofit): AdminApi =
        retrofit.create(AdminApi::class.java)

    @Provides
    @Singleton
    fun provideRecommendationsApi(retrofit: Retrofit): RecommendationsApi =
        retrofit.create(RecommendationsApi::class.java)
}
