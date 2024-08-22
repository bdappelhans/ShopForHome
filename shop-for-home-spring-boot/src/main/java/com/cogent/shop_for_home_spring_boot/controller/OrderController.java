package com.cogent.shop_for_home_spring_boot.controller;

import com.cogent.shop_for_home_spring_boot.dto.UserDto;
import com.cogent.shop_for_home_spring_boot.entity.Order;
import com.cogent.shop_for_home_spring_boot.entity.User;
import com.cogent.shop_for_home_spring_boot.service.OrderService;
import com.cogent.shop_for_home_spring_boot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("all/placed")
    public List<Order> getAllPlacedOrders() {
        return orderService.getAllPlacedOrders();
    }

    @GetMapping("/startDate={startDate}&endDate={endDate}")
    public List<Order> getOrdersByDate(@PathVariable LocalDate startDate, @PathVariable LocalDate endDate) {
        return orderService.getOrdersWithinDateRange(startDate, endDate);
    }

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
        User orderUser = userService.getById(order.getUserId());
        if (orderUser != null && orderUser.getCoupon() != null) {

            if (orderUser.getCoupon().getId().equals(order.getCoupon().getId())) {
                System.out.println("Removing coupon from user " + orderUser.getId());
                orderUser.setCoupon(null);
                userService.saveUser(new UserDto(orderUser));
            }
        }
        Order placedOrder = orderService.updateOrder(order);

        if (placedOrder != null) {
            Order newOrder = new Order();
            newOrder.setUserId(order.getUserId());
            orderService.createOrder(newOrder);
        }
        return placedOrder;
    }
}
