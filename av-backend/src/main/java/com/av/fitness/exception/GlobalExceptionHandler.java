package com.av.fitness.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Global exception handler that converts Java exceptions into
 * structured JSON responses consumed by the frontend.
 * <p>
 * The frontend {@code apiClient.js} reads {@code err.message}
 * from the response body, so all error responses include a
 * {@code "message"} field.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Catches all {@link RuntimeException} thrown by services or controllers
     * and returns a 400 Bad Request with the exception message.
     * <p>
     * Examples:
     * <ul>
     *   <li>Invalid login credentials</li>
     *   <li>Duplicate email on registration</li>
     *   <li>Expired or invalid verification code</li>
     *   <li>Entity not found by ID</li>
     * </ul>
     *
     * @param ex the runtime exception
     * @return 400 with {@code {"message": "...", "status": 400}}
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        log.warn("Runtime exception: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "message", ex.getMessage() != null ? ex.getMessage() : "Error inesperado",
                        "status", 400,
                        "timestamp", LocalDateTime.now().toString()
                ));
    }

    /**
     * Fallback handler for any unexpected exception not caught by more
     * specific handlers. Returns a generic 500 error without leaking
     * internal details to the client.
     *
     * @param ex the unhandled exception
     * @return 500 with {@code {"message": "Error interno del servidor", "status": 500}}
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception ex) {
        log.error("Unhandled exception", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "message", "Error interno del servidor",
                        "status", 500,
                        "timestamp", LocalDateTime.now().toString()
                ));
    }
}
