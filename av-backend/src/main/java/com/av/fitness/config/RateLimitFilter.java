package com.av.fitness.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Implements rate limiting using bucket4j.
 * Limits login attempts to {@value #MAX_ATTEMPTS} per IP within a {@value #WINDOW_SECONDS}-second window.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log =
            LoggerFactory.getLogger(RateLimitFilter.class);
    private static final int MAX_ATTEMPTS = 10;
    private static final long WINDOW_SECONDS = 60;
    private static final String LOGIN_PATH = "/api/auth/login";

    private final ConcurrentHashMap<String, AttemptWindow> attemptsPerIp =
            new ConcurrentHashMap<>();
    private final ScheduledExecutorService cleanupScheduler =
            Executors.newSingleThreadScheduledExecutor(r -> {
                Thread t = new Thread(r, "rate-limit-cleanup");
                t.setDaemon(true);
                return t;
            });

    /**
     * Schedules a periodic cleanup task that evicts expired IP entries every minute.
     */
    public RateLimitFilter() {
        cleanupScheduler.scheduleAtFixedRate(
                this::cleanupExpired, 1, 1, TimeUnit.MINUTES);
    }

    /**
     * Applies rate limiting only to {@code POST /api/auth/login}.
     * Returns HTTP 429 with a JSON error body when the limit is exceeded.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        if (!LOGIN_PATH.equals(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);
        AttemptWindow window = attemptsPerIp.computeIfAbsent(
                clientIp, k -> new AttemptWindow());

        synchronized (window) {
            long now = Instant.now().getEpochSecond();
            if (now - window.windowStart >= WINDOW_SECONDS) {
                window.windowStart = now;
                window.count.set(0);
            }

            if (window.count.incrementAndGet() > MAX_ATTEMPTS) {
                log.warn("Rate limit exceeded for IP: {}", clientIp);
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setHeader("Retry-After", String.valueOf(WINDOW_SECONDS));
                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"error\":\"Demasiadas solicitudes. Intente nuevamente en 1 minuto.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Removes entries whose window is older than twice the configured window duration.
     */
    private void cleanupExpired() {
        long now = Instant.now().getEpochSecond();
        Iterator<Map.Entry<String, AttemptWindow>> it =
                attemptsPerIp.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, AttemptWindow> entry = it.next();
            if (now - entry.getValue().windowStart >= WINDOW_SECONDS * 2) {
                it.remove();
            }
        }
    }

    /**
     * Resolves the client IP, preferring the {@code X-Forwarded-For} header.
     *
     * @param request the incoming HTTP request
     * @return the client's remote IP address
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * Holds per-IP attempt count and the start of the current time window.
     */
    private static class AttemptWindow {
        long windowStart = Instant.now().getEpochSecond();
        AtomicInteger count = new AtomicInteger(0);
    }
}
