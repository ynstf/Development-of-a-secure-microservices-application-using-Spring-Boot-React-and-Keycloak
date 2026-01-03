package com.ecommerce.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS Configuration for API Gateway
 * Allows frontend applications to access the gateway
 * Note: Keycloak paths (/realms/**) are excluded as Keycloak handles its own CORS
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // Allowed origins (frontend applications)
        corsConfig.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",  // React dev server
                "http://localhost:3001",  // Alternative React port
                "http://localhost:4200"   // Angular (if needed)
        ));

        // Allowed HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        // Allowed headers
        corsConfig.setAllowedHeaders(List.of("*"));

        // Allow credentials (cookies, authorization headers)
        corsConfig.setAllowCredentials(true);

        // Max age for preflight requests (1 hour)
        corsConfig.setMaxAge(3600L);

        // Exposed headers (headers that frontend can access)
        corsConfig.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Apply CORS to all paths EXCEPT Keycloak paths
        // Keycloak handles its own CORS
        source.registerCorsConfiguration("/api/**", corsConfig);
        source.registerCorsConfiguration("/actuator/**", corsConfig);

        return new CorsWebFilter(source);
    }
}