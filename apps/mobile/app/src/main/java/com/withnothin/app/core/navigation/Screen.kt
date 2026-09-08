package com.withnothin.app.core.navigation

sealed class Screen(val route: String) {
    data object Login : Screen("login")
    data object Register : Screen("register")
    data object ProfileOnboarding : Screen("onboarding/profile")
    data object Feed : Screen("feed")
    data object NewPost : Screen("posts/new")
    data object Saves : Screen("saves")
    data object Notifications : Screen("notifications")
    data object Search : Screen("search")
    data object BlockedUsers : Screen("settings/blocked")
    data object Projects : Screen("projects")
    data object NewProject : Screen("projects/new")

    data object ProjectDetail : Screen("projects/{projectId}") {
        fun createRoute(projectId: String) = "projects/$projectId"
    }

    data object PostDetail : Screen("posts/{postId}") {
        fun createRoute(postId: String) = "posts/$postId"
    }

    data object PublicProfile : Screen("profiles/{username}") {
        fun createRoute(username: String) = "profiles/$username"
    }
}
