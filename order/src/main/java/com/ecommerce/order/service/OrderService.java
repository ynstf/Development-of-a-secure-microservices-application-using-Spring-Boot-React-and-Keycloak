package com.ecommerce.order.service;

import com.ecommerce.order.dto.OrderRequest;
import com.ecommerce.order.dto.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request, String userId, String username);
    OrderResponse getOrderById(Long id, String userId, boolean isAdmin);
    List<OrderResponse> getUserOrders(String userId);
    List<OrderResponse> getAllOrders();
}