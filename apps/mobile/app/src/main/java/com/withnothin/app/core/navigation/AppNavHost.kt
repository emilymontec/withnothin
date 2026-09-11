package com.withnothin.app.core.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.withnothin.app.feature.admin.ui.AdminScreen
import com.withnothin.app.feature.auth.ui.LoginScreen
import com.withnothin.app.feature.auth.ui.RegisterScreen
import com.withnothin.app.feature.communities.ui.CommunitiesListScreen
import com.withnothin.app.feature.communities.ui.CommunityDetailScreen
import com.withnothin.app.feature.communities.ui.NewCommunityScreen
import com.withnothin.app.feature.feed.ui.FeedScreen
import com.withnothin.app.feature.moderation.ui.BlockedUsersScreen
import com.withnothin.app.feature.notifications.ui.NotificationsScreen
import com.withnothin.app.feature.posts.ui.NewPostScreen
import com.withnothin.app.feature.posts.ui.PostDetailScreen
import com.withnothin.app.feature.profile.userprofile.ui.PublicProfileScreen
import com.withnothin.app.feature.profile.ui.ProfileOnboardingScreen
import com.withnothin.app.feature.projects.ui.NewProjectScreen
import com.withnothin.app.feature.projects.ui.ProjectDetailScreen
import com.withnothin.app.feature.projects.ui.ProjectsListScreen
import com.withnothin.app.feature.saves.ui.SavesScreen
import com.withnothin.app.feature.search.ui.SearchScreen

@Composable
fun AppNavHost(navController: NavHostController = rememberNavController()) {
    NavHost(navController = navController, startDestination = Screen.Login.route) {
        composable(Screen.Login.route) {
            LoginScreen(
                onAuthenticated = {
                    // El login asume que el usuario ya completó su perfil.
                    // Si no fue así, el propio backend devuelve 404 en
                    // /profiles/me y las pantallas dependientes lo manejan
                    // como error — no hay una redirección automática todavía.
                    navController.navigate(Screen.Feed.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                onNavigateToRegister = { navController.navigate(Screen.Register.route) },
            )
        }

        composable(Screen.Register.route) {
            RegisterScreen(
                onRegistered = {
                    navController.navigate(Screen.ProfileOnboarding.route) {
                        popUpTo(Screen.Login.route) { inclusive = true }
                    }
                },
                onNavigateToLogin = { navController.popBackStack() },
            )
        }

        composable(Screen.ProfileOnboarding.route) {
            ProfileOnboardingScreen(
                onCompleted = {
                    navController.navigate(Screen.Feed.route) {
                        popUpTo(Screen.ProfileOnboarding.route) { inclusive = true }
                    }
                },
            )
        }

        composable(Screen.Feed.route) {
            FeedScreen(
                onPostClick = { postId -> navController.navigate(Screen.PostDetail.createRoute(postId)) },
                onAuthorClick = { username -> navController.navigate(Screen.PublicProfile.createRoute(username)) },
                onNewPostClick = { navController.navigate(Screen.NewPost.route) },
                onSavesClick = { navController.navigate(Screen.Saves.route) },
                onNotificationsClick = { navController.navigate(Screen.Notifications.route) },
                onSearchClick = { navController.navigate(Screen.Search.route) },
                onBlockedUsersClick = { navController.navigate(Screen.BlockedUsers.route) },
                onProjectsClick = { navController.navigate(Screen.Projects.route) },
                onCommunitiesClick = { navController.navigate(Screen.Communities.route) },
                onAdminClick = { navController.navigate(Screen.Admin.route) },
            )
        }

        composable(Screen.Admin.route) {
            AdminScreen()
        }

        composable(Screen.Search.route) {
            SearchScreen(
                onPostClick = { postId -> navController.navigate(Screen.PostDetail.createRoute(postId)) },
                onProfileClick = { username -> navController.navigate(Screen.PublicProfile.createRoute(username)) },
            )
        }

        composable(Screen.BlockedUsers.route) {
            BlockedUsersScreen()
        }

        composable(Screen.Projects.route) {
            ProjectsListScreen(
                onProjectClick = { projectId -> navController.navigate(Screen.ProjectDetail.createRoute(projectId)) },
                onNewProjectClick = { navController.navigate(Screen.NewProject.route) },
            )
        }

        composable(Screen.NewProject.route) {
            NewProjectScreen(
                onCreated = { projectId ->
                    navController.navigate(Screen.ProjectDetail.createRoute(projectId)) {
                        popUpTo(Screen.Projects.route)
                    }
                },
            )
        }

        composable(
            route = Screen.ProjectDetail.route,
            arguments = listOf(navArgument("projectId") { type = NavType.StringType }),
        ) {
            ProjectDetailScreen(
                onOwnerClick = { username -> navController.navigate(Screen.PublicProfile.createRoute(username)) },
            )
        }

        composable(Screen.Communities.route) {
            CommunitiesListScreen(
                onCommunityClick = { slug -> navController.navigate(Screen.CommunityDetail.createRoute(slug)) },
                onNewCommunityClick = { navController.navigate(Screen.NewCommunity.route) },
            )
        }

        composable(Screen.NewCommunity.route) {
            NewCommunityScreen(
                onCreated = { slug ->
                    navController.navigate(Screen.CommunityDetail.createRoute(slug)) {
                        popUpTo(Screen.Communities.route)
                    }
                },
            )
        }

        composable(
            route = Screen.CommunityDetail.route,
            arguments = listOf(navArgument("slug") { type = NavType.StringType }),
        ) {
            CommunityDetailScreen(
                onPostClick = { postId -> navController.navigate(Screen.PostDetail.createRoute(postId)) },
                onAuthorClick = { username -> navController.navigate(Screen.PublicProfile.createRoute(username)) },
            )
        }

        composable(Screen.Saves.route) {
            SavesScreen(
                onPostClick = { postId -> navController.navigate(Screen.PostDetail.createRoute(postId)) },
                onAuthorClick = { username -> navController.navigate(Screen.PublicProfile.createRoute(username)) },
            )
        }

        composable(Screen.Notifications.route) {
            NotificationsScreen(
                onNotificationClick = { notification ->
                    val postId = notification.payload?.get("postId") as? String
                    if (postId != null) {
                        navController.navigate(Screen.PostDetail.createRoute(postId))
                    }
                },
            )
        }

        composable(Screen.NewPost.route) {
            NewPostScreen(
                onPosted = { postId ->
                    navController.navigate(Screen.PostDetail.createRoute(postId)) {
                        popUpTo(Screen.Feed.route)
                    }
                },
            )
        }

        composable(
            route = Screen.PostDetail.route,
            arguments = listOf(navArgument("postId") { type = NavType.StringType }),
        ) {
            PostDetailScreen(
                onAuthorClick = { username -> navController.navigate(Screen.PublicProfile.createRoute(username)) },
            )
        }

        composable(
            route = Screen.PublicProfile.route,
            arguments = listOf(navArgument("username") { type = NavType.StringType }),
        ) {
            PublicProfileScreen(
                onPostClick = { postId -> navController.navigate(Screen.PostDetail.createRoute(postId)) },
            )
        }
    }
}
