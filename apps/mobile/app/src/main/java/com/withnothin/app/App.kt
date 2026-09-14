package com.withnothin.app

import android.app.Application
import com.withnothin.app.core.session.SessionSync
import dagger.hilt.android.HiltAndroidApp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.Dispatchers
import javax.inject.Inject

@HiltAndroidApp
class App : Application() {

    // Vive tanto como el proceso — SessionSync tiene que sobrevivir a
    // que se destruya/recree la Activity o cualquier ViewModel.
    private val appScope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    @Inject
    lateinit var sessionSync: SessionSync

    override fun onCreate() {
        super.onCreate()
        sessionSync.start(appScope)
    }
}
