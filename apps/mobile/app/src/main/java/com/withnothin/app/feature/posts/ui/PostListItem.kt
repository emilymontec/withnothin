package com.withnothin.app.feature.posts.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Divider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.withnothin.app.data.remote.dto.PostDto

/**
 * Tarjeta de post compacta, equivalente al `PostCard` de la web.
 * Se usa tanto en el feed como en el perfil público — no tiene
 * conocimiento de dónde se navega al tocarla (eso lo decide el caller).
 */
@Composable
fun PostListItem(
    post: PostDto,
    onClick: () -> Unit,
    onAuthorClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 12.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(text = post.type)
            Text(
                text = "@${post.author.username}",
                modifier = Modifier.clickable(onClick = onAuthorClick),
            )
        }
        Text(text = post.content, maxLines = 4)
        Text(text = "${post.likesCount} likes · ${post.commentsCount} comentarios")
    }
    Divider()
}
