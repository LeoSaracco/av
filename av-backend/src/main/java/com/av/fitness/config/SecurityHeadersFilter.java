package com.av.fitness.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Adds security headers (X-Content-Type-Options, X-Frame-Options, etc.).
 * Sets Content-Security-Policy, HSTS, Referrer-Policy, and Permissions-Policy on every response.
 */
@Component
public class SecurityHeadersFilter extends OncePerRequestFilter {

    /**
     * Appends security-related HTTP headers to the response before passing it down the filter chain.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        response.setHeader("Content-Security-Policy",
                "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("Strict-Transport-Security",
                "max-age=31536000; includeSubDomains");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        response.setHeader("Permissions-Policy",
                "camera=(), microphone=(), geolocation=()");
        response.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
        response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        response.setHeader("Cross-Origin-Resource-Policy", "same-origin");

        filterChain.doFilter(request, response);
    }
}
