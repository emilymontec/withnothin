package com.withnothin.app.feature.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.withnothin.app.data.remote.dto.CreateProfileRequest
import com.withnothin.app.data.remote.service.ProfilesApi
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import retrofit2.HttpException
import javax.inject.Inject

@HiltViewModel
class ProfileOnboardingViewModel @Inject constructor(
    private val profilesApi: ProfilesApi,
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProfileOnboardingUiState())
    val uiState: StateFlow<ProfileOnboardingUiState> = _uiState.asStateFlow()

    fun onUsernameChange(value: String) =
        _uiState.update { it.copy(username = value.lowercase(), errorMessage = null) }

    fun onDisplayNameChange(value: String) =
        _uiState.update { it.copy(displayName = value, errorMessage = null) }

    fun submit() {
        val state = _uiState.value

        if (!Regex("^[a-z0-9_]{3,30}$").matches(state.username)) {
            _uiState.update {
                it.copy(errorMessage = "El username debe tener 3-30 caracteres: minúsculas, números o _")
            }
            return
        }
        if (state.displayName.isBlank()) {
            _uiState.update { it.copy(errorMessage = "El nombre para mostrar es obligatorio") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isSaving = true, errorMessage = null) }
            try {
                profilesApi.createMyProfile(
                    CreateProfileRequest(username = state.username, displayName = state.displayName),
                )
                _uiState.update { it.copy(isSaving = false, isCompleted = true) }
            } catch (e: HttpException) {
                val message = if (e.code() == 409) "Ese username ya está en uso" else "No se pudo guardar el perfil"
                _uiState.update { it.copy(isSaving = false, errorMessage = message) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isSaving = false, errorMessage = e.message ?: "Error inesperado") }
            }
        }
    }
}
