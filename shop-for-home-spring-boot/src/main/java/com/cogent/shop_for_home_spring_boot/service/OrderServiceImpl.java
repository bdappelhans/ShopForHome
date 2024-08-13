package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.entity.Order;
import com.cogent.shop_for_home_spring_boot.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Order getOrderById(Long id) {
        Order foundOrder = orderRepository.findById(id).orElse(null);

        if (foundOrder == null) {
            System.out.println("Order " + id + " not found");
        }
        return foundOrder;
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getAllPlacedOrders() {
        return orderRepository.findByIsPlacedTrue();
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public List<Order> getPlacedOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Order getUnplacedOrderByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserIdAndIsPlacedFalse(userId);

        if (orders == null || orders.size() == 0) {
            return null;
        } else {
            return orders.get(0);
        }
    }

    @Override
    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Order order) {
        Order foundOrder = orderRepository.findById(order.getId()).orElse(null);
        if (foundOrder == null) {
            return null;
        } else {
            return orderRepository.save(order);
        }
    }
}
