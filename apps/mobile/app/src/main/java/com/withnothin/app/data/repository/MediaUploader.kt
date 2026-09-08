package com.withnothin.app.data.repository

import com.withnothin.app.data.remote.dto.MediaAssetResponse
import com.withnothin.app.data.remote.dto.RequestUploadUrlBody
import com.withnothin.app.data.remote.service.MediaApi
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.storage.storage
import javax.inject.Inject

private const val STORAGE_BUCKET = "media"

/**
 * Equivalente Android del `media-service.ts` de la web: implementa el
 * mismo flujo de 3 pasos definido en la arquitectura (sección 10).
 * El archivo nunca pasa por nuestra API — solo la referencia final.
 */
class MediaUploader @Inject constructor(
    private val mediaApi: MediaApi,
    private val supabase: SupabaseClient,
) {

    suspend fun upload(fileName: String, mimeType: String, bytes: ByteArray): MediaAssetResponse {
        val uploadUrl = mediaApi.requestUploadUrl(
            RequestUploadUrlBody(fileName = fileName, mimeType = mimeType, sizeBytes = bytes.size.toLong()),
        )

        supabase.storage.from(STORAGE_BUCKET)
            .uploadToSignedUrl(path = uploadUrl.path, token = uploadUrl.token, data = bytes)

        return mediaApi.confirmUpload(uploadUrl.mediaId)
    }
}
