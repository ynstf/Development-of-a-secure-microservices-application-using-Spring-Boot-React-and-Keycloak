package com.ecommerce.gateway.config;

import com.ecommerce.gateway.filter.LoggingFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class GatewayConfig {

    private final LoggingFilter loggingFilter;

    @Value("${microservices.product-service.url}")
    private String productServiceUrl;

    @Value("${microservices.order-service.url}")
    private String orderServiceUrl;

    @Value("${keycloak.url:http://keycloak:8080}")
    private String keycloakUrl;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        log.info("Configuring gateway routes programmatically");
        log.info("Product Service URL: {}", productServiceUrl);
        log.info("Order Service URL: {}", orderServiceUrl);
        log.info("Keycloak URL: {}", keycloakUrl);

        return builder.routes()
                // Product Service Routes
                .route("product-service", r -> r
                        .path("/api/products/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                        )
                        .uri(productServiceUrl)
                )

                // Order Service Routes
                .route("order-service", r -> r
                        .path("/api/orders/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                        )
                        .uri(orderServiceUrl)
                )

                // Keycloak Authentication Routes (Token endpoint, etc.)
                .route("keycloak-auth", r -> r
                        .path("/realms/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                        )
                        .uri(keycloakUrl)
                )

                // Keycloak Admin Console (optional, for debugging)
                .route("keycloak-admin", r -> r
                        .path("/admin/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                        )
                        .uri(keycloakUrl)
                )

                // Keycloak Resources (CSS, JS, etc.)
                .route("keycloak-resources", r -> r
                        .path("/resources/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                        )
                        .uri(keycloakUrl)
                )

                .build();
    }
}