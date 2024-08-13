package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.entity.Order;

import java.util.List;

public interface OrderService {

    Order getOrderById(Long id);

    List<Order> getAllOrders();

    List<Order> getAllPlacedOrders();

    List<Order> getOrdersByUserId(Long userId);

    List<Order> getPlacedOrdersByUserId(Long userId);

    Order getUnplacedOrderByUserId(Long userId);

    Order createOrder(Order order);

    Order updateOrder(Order order);
}
