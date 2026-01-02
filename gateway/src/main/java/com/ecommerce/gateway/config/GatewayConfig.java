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

    @Bean // Activated this bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        log.info("Configuring gateway routes programmatically");

        return builder.routes()
                .route("product-service", r -> r
                        .path("/api/products/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                        )
                        .uri(productServiceUrl)
                )
                .route("order-service", r -> r
                        .path("/api/orders/**")
                        .filters(f -> f
                                .filter(loggingFilter.apply(new LoggingFilter.Config()))
                        )
                        .uri(orderServiceUrl)
                )
                .route("keycloak-auth", r -> r
                        .path("/realms/ecommerce/protocol/openid-connect/**")
                        .uri("http://localhost:8080")
                )
                .build();
    }
}