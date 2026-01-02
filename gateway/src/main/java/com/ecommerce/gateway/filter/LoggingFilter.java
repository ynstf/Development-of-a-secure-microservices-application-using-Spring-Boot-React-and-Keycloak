package com.ecommerce.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;

/**
 * Logging Filter for API Gateway
 * Logs all incoming requests and outgoing responses with timing information
 */
@Component
@Slf4j
public class LoggingFilter extends AbstractGatewayFilterFactory<LoggingFilter.Config> {

    public LoggingFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            ServerHttpResponse response = exchange.getResponse();

            Instant startTime = Instant.now();

            // Log request details
            logRequest(request);

            return chain.filter(exchange)
                    .then(Mono.fromRunnable(() -> {
                        // Log response details with execution time
                        Instant endTime = Instant.now();
                        Duration duration = Duration.between(startTime, endTime);
                        logResponse(request, response, duration);
                    }));
        };
    }

    /**
     * Log incoming request details
     */
    private void logRequest(ServerHttpRequest request) {
        String method = request.getMethod().toString();
        String path = request.getPath().toString();
        String clientIp = getClientIp(request);

        log.info("==> Incoming Request: {} {} from IP: {}", method, path, clientIp);

        // Log headers (excluding sensitive information)
        HttpHeaders headers = request.getHeaders();
        if (headers.containsKey(HttpHeaders.AUTHORIZATION)) {
            log.debug("Authorization header present: Bearer token");
        }
        if (headers.containsKey(HttpHeaders.CONTENT_TYPE)) {
            log.debug("Content-Type: {}", headers.getFirst(HttpHeaders.CONTENT_TYPE));
        }
        if (headers.containsKey(HttpHeaders.USER_AGENT)) {
            log.debug("User-Agent: {}", headers.getFirst(HttpHeaders.USER_AGENT));
        }
    }

    /**
     * Log outgoing response details
     */
    private void logResponse(ServerHttpRequest request, ServerHttpResponse response, Duration duration) {
        String method = request.getMethod().toString();
        String path = request.getPath().toString();
        int statusCode = response.getStatusCode() != null ? response.getStatusCode().value() : 0;

        String logLevel = statusCode >= 400 ? "ERROR" : "INFO";
        String emoji = statusCode >= 500 ? "❌" : statusCode >= 400 ? "⚠️" : "✅";

        log.info("{} <== Response: {} {} | Status: {} | Duration: {}ms",
                emoji, method, path, statusCode, duration.toMillis());
    }

    /**
     * Extract client IP address from request
     */
    private String getClientIp(ServerHttpRequest request) {
        HttpHeaders headers = request.getHeaders();

        // Check X-Forwarded-For header (if behind proxy)
        String xForwardedFor = headers.getFirst("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        // Check X-Real-IP header
        String xRealIp = headers.getFirst("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        // Fallback to remote address
        if (request.getRemoteAddress() != null) {
            return request.getRemoteAddress().getAddress().getHostAddress();
        }

        return "Unknown";
    }

    public static class Config {
        // Configuration properties can be added here if needed
    }
}