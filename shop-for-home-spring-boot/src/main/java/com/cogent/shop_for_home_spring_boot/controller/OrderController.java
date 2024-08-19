package com.cogent.shop_for_home_spring_boot.controller;

import com.cogent.shop_for_home_spring_boot.dto.UserDto;
import com.cogent.shop_for_home_spring_boot.entity.Order;
import com.cogent.shop_for_home_spring_boot.entity.User;
import com.cogent.shop_for_home_spring_boot.service.OrderService;
import com.cogent.shop_for_home_spring_boot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @GetMapping("/{userId}/unplaced")
    public Order getUnplacedOrders(@PathVariable Long userId) {
        return orderService.getUnplacedOrderByUserId(userId);
    }

    @PutMapping("/update")
    public Order updateOrder(@RequestBody Order order) {
        System.out.println("Attempting to update order " + order.getId());
        return orderService.updateOrder(order);
    }

    @PutMapping("/place")
    public Order placeOrder(@RequestBody Order order) {
        System.out.println("Attempting to place order " + order.getId());
        // set placed value to true, stamp order date and time
        order.setPlaced(true);
        order.setOrderDate(LocalDateTime.now());

        // remove coupon from user if used in order
        User orderUser = userService.getById(order.getId());
        if (orderUser != null) {
            if (orderUser.getCoupon().getId().equals(order.getCoupon().getId())) {
                orderUser.setCoupon(null);
                userService.saveUser(new UserDto(orderUser));
            }
        }

        return orderService.updateOrder(order);
    }
}
