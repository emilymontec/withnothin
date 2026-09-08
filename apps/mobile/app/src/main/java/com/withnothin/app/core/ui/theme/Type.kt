package com.withnothin.app.core.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.withnothin.app.R

/**
 * Misma pareja tipográfica que la web (ver docs/web/DESIGN_SYSTEM.md):
 * Bristol para titulares, Josefin Sans para cuerpo y UI. Ambas se
 * empaquetan como archivos locales en res/font — se descartó el
 * Google Fonts Provider de Android para Josefin Sans porque agrega
 * una dependencia de red en tiempo de ejecución (la fuente se
 * descarga la primera vez que el usuario abre la app) que no aporta
 * valor frente a simplemente empaquetar el archivo, igual que Bristol.
 */
val BristolFontFamily = FontFamily(Font(R.font.bristol, FontWeight.Normal))

// Josefin Sans es una fuente variable (eje "wght"); Compose puede leer
// el archivo variable directamente y Android resuelve el peso Normal
// por defecto. Si más adelante se necesitan pesos Medium/SemiBold/Bold
// explícitos, se resuelve con FontVariation.Settings sobre el mismo
// archivo — no hace falta empaquetar un .ttf por peso.
val JosefinSansFontFamily = FontFamily(Font(R.font.josefin_sans, FontWeight.Normal))

val WithNothinTypography = Typography(
    headlineLarge = TextStyle(fontFamily = BristolFontFamily, fontWeight = FontWeight.Normal, fontSize = 32.sp),
    headlineMedium = TextStyle(fontFamily = BristolFontFamily, fontWeight = FontWeight.Normal, fontSize = 24.sp),
    headlineSmall = TextStyle(fontFamily = BristolFontFamily, fontWeight = FontWeight.Normal, fontSize = 20.sp),
    titleLarge = TextStyle(fontFamily = BristolFontFamily, fontWeight = FontWeight.Normal, fontSize = 18.sp),

    titleMedium = TextStyle(fontFamily = JosefinSansFontFamily, fontWeight = FontWeight.Medium, fontSize = 16.sp),
    titleSmall = TextStyle(fontFamily = JosefinSansFontFamily, fontWeight = FontWeight.Medium, fontSize = 14.sp),
    bodyLarge = TextStyle(fontFamily = JosefinSansFontFamily, fontWeight = FontWeight.Normal, fontSize = 16.sp),
    bodyMedium = TextStyle(fontFamily = JosefinSansFontFamily, fontWeight = FontWeight.Normal, fontSize = 14.sp),
    bodySmall = TextStyle(fontFamily = JosefinSansFontFamily, fontWeight = FontWeight.Normal, fontSize = 12.sp),
    labelLarge = TextStyle(fontFamily = JosefinSansFontFamily, fontWeight = FontWeight.Medium, fontSize = 14.sp),
    labelMedium = TextStyle(fontFamily = JosefinSansFontFamily, fontWeight = FontWeight.Medium, fontSize = 12.sp),
    labelSmall = TextStyle(fontFamily = JosefinSansFontFamily, fontWeight = FontWeight.Medium, fontSize = 11.sp),
)
