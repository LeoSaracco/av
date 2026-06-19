package com.av.fitness.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configures Spring Security: public/private routes, CORS, JWT filter,
 * exception handling with JSON 401/403 responses, permitAll for payment and plan-contracts endpoints.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    private final JwtAuthFilter jwtAuthFilter;
    private final SecurityHeadersFilter securityHeadersFilter;
    private final RateLimitFilter rateLimitFilter;

    /**
     * @param jwtAuthFilter         the JWT authentication filter
     * @param securityHeadersFilter the security headers filter
     * @param rateLimitFilter       the rate-limiting filter
     */
    public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                          SecurityHeadersFilter securityHeadersFilter,
                          RateLimitFilter rateLimitFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.securityHeadersFilter = securityHeadersFilter;
        this.rateLimitFilter = rateLimitFilter;
    }

    /**
     * @return a {@link BCryptPasswordEncoder} with strength 12
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Defines the security filter chain with stateless sessions, CORS,
     * role-based authorization, and custom exception handling that returns JSON 401/403 bodies.
     *
     * @param http the {@link HttpSecurity} to configure
     * @return the built {@link SecurityFilterChain}
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/plans").permitAll()
                        .requestMatchers("/api/plan-contracts/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/onboarding").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**")
                            .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/payment/create-preference")
                            .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/payment/status/**")
                            .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/payment/webhook")
                            .permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                            .permitAll()
                        .requestMatchers("/api/coach/**").hasRole("COACH")
                        .requestMatchers("/api/me/**").hasRole("CLIENT")
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setContentType("application/json");
                            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            res.getWriter().write("{\"error\":\"No autenticado\",\"status\":401}");
                        })
                        .accessDeniedHandler((req, res, e) -> {
                            res.setContentType("application/json");
                            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            res.getWriter().write("{\"error\":\"Acceso denegado\",\"status\":403}");
                        }))
                .addFilterBefore(securityHeadersFilter,
                        UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(rateLimitFilter,
                        UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Builds a {@link CorsConfigurationSource} from comma-separated origins in {@code cors.allowed-origins}.
     * Allows common HTTP methods, all headers, and credentials.
     *
     * @return a URL-based CORS configuration source applied to all paths
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .toList();
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
