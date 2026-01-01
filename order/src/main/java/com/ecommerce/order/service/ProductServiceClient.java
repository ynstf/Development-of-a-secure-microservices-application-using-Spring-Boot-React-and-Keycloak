package com.ecommerce.order.service;

import com.ecommerce.order.dto.ProductDTO;
import com.ecommerce.order.exception.ProductNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceClient {

    private final RestTemplate restTemplate;

    @Value("${product.service.url}")
    private String productServiceUrl;

    public ProductDTO getProductById(Long productId) {
        log.info("Fetching product with ID: {} from Product Service", productId);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(getJwtToken());

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<ProductDTO> response = restTemplate.exchange(
                    productServiceUrl + "/" + productId,
                    HttpMethod.GET,
                    entity,
                    ProductDTO.class
            );

            log.info("Successfully fetched product: {}", response.getBody());
            return response.getBody();

        } catch (HttpClientErrorException.NotFound e) {
            log.error("Product not found with ID: {}", productId);
            throw new ProductNotFoundException("Product not found with id: " + productId);
        } catch (Exception e) {
            log.error("Error communicating with Product Service: {}", e.getMessage());
            throw new RuntimeException("Error communicating with Product Service: " + e.getMessage());
        }
    }

    private String getJwtToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            return jwt.getTokenValue();
        }

        throw new RuntimeException("No JWT token found in security context");
    }
}