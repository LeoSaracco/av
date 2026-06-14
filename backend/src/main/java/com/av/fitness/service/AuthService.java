package com.av.fitness.service;

import com.av.fitness.dto.MessageResponse;
import com.av.fitness.dto.auth.LoginRequest;
import com.av.fitness.dto.auth.RefreshRequest;
import com.av.fitness.dto.auth.RegisterRequest;
import com.av.fitness.dto.auth.TokenResponse;

public interface AuthService {

    /** Registro de nuevo cliente — devuelve tokens JWT */
    TokenResponse register(RegisterRequest request);

    /** Inicio de sesión — devuelve tokens JWT */
    TokenResponse login(LoginRequest request);

    /** Refresca el access token usando un refresh token válido */
    TokenResponse refresh(RefreshRequest request);

    /** Verifica el email del usuario mediante el código enviado */
    MessageResponse verifyEmail(String email, String code);

    /** Invalida el refresh token (logout) */
    void logout(String token);
}
