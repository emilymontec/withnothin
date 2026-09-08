package com.withnothin.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Surface
import com.withnothin.app.core.navigation.AppNavHost
import com.withnothin.app.core.ui.theme.WithNothinTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            WithNothinTheme {
                Surface {
                    AppNavHost()
                }
            }
        }
    }
}
