package com.withnothin.app.core.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

/**
 * Traducción del brandboard a un ColorScheme de Material 3. Se
 * reutiliza Material 3 como base (no se justifica un design system
 * propio desde cero en Compose), pero se restringe estrictamente a
 * la paleta monocromática — igual criterio que en la web.
 */
private val WithNothinColorScheme = lightColorScheme(
    primary = Ink,
    onPrimary = Paper,
    secondary = Ink,
    onSecondary = Paper,
    background = Paper,
    onBackground = Ink,
    surface = Surface,
    onSurface = Ink,
    error = ErrorColor,
)

@Composable
fun WithNothinTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = WithNothinColorScheme,
        typography = WithNothinTypography,
        content = content,
    )
}
