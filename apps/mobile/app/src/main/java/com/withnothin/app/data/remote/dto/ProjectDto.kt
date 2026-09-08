package com.withnothin.app.data.remote.dto

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

@JsonClass(generateAdapter = true)
data class ProjectOwnerDto(
    val id: String,
    val username: String,
    @Json(name = "displayName") val displayName: String,
    @Json(name = "avatarUrl") val avatarUrl: String?,
)

@JsonClass(generateAdapter = true)
data class ProjectMemberDto(
    val userId: String,
    val username: String,
    @Json(name = "displayName") val displayName: String,
    val role: String,
)

@JsonClass(generateAdapter = true)
data class ProjectLinkDto(val id: String, val label: String, val url: String)

@JsonClass(generateAdapter = true)
data class ProjectDto(
    val id: String,
    val name: String,
    val description: String?,
    val status: String,
    val owner: ProjectOwnerDto,
    val members: List<ProjectMemberDto>,
    val technologies: List<PostTechnologyRefDto>,
    val links: List<ProjectLinkDto>,
    @Json(name = "createdAt") val createdAt: String,
)

@JsonClass(generateAdapter = true)
data class CreateProjectLinkInput(val label: String, val url: String)

@JsonClass(generateAdapter = true)
data class CreateProjectBody(
    val name: String,
    val description: String? = null,
    val technologies: List<String>? = null,
    val links: List<CreateProjectLinkInput>? = null,
)

@JsonClass(generateAdapter = true)
data class UpdateProjectBody(
    val status: String? = null,
)
