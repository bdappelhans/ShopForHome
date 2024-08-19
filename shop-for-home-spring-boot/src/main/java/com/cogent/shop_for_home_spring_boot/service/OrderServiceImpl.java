package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.entity.Order;
import com.cogent.shop_for_home_spring_boot.entity.OrderProduct;
import com.cogent.shop_for_home_spring_boot.entity.Product;
import com.cogent.shop_for_home_spring_boot.repository.OrderRepository;
import com.cogent.shop_for_home_spring_boot.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

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
        order.setId(0L);
        order.setOrderDate(null);
        order.setCoupon(null);
        order.setInitialTotal(BigDecimal.ZERO);
        order.setDiscount(BigDecimal.ZERO);
        order.setFinalTotal(BigDecimal.ZERO);
        order.setPlaced(false);
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Order order) {
        Order foundOrder = orderRepository.findById(order.getId()).orElse(null);
        if (foundOrder == null) {
            return null;
        } else {
            // calculate discount and totals
            BigDecimal initialTotal = BigDecimal.ZERO;

            for (OrderProduct op : order.getOrderProducts()) {
                Product product = productRepository.findById(op.getId().getProductId()).orElse(null);

                if (product != null) {
                    initialTotal = (initialTotal.add(product.getPrice()).multiply(new BigDecimal(op.getQuantity())));
                } else {
                    order.getOrderProducts().remove(op);
                }
            }

            order.setInitialTotal(initialTotal);

            if (order.getCoupon() != null) {
                BigDecimal couponDiscountPercentage = order.getCoupon().getDiscount().divide(new BigDecimal(100));
                BigDecimal discount = initialTotal.multiply(couponDiscountPercentage);
                discount = discount.setScale(2, RoundingMode.HALF_UP);
                order.setDiscount(discount);
            } else {
                order.setDiscount(BigDecimal.ZERO);
            }

            BigDecimal finalTotal = initialTotal.subtract(order.getDiscount());
            order.setFinalTotal(finalTotal);

            return orderRepository.save(order);
        }
    }

    @Override
    public List<Order> getOrdersWithinDateRange(LocalDate start, LocalDate end) {
        LocalDateTime startDateTime = start.atStartOfDay(); // 2024-08-01T00:00:00
        LocalDateTime endDateTime = end.atTime(LocalTime.MAX); // 2024-08-31T23:59:59.999999999

        return orderRepository.findByIsPlacedTrueAndOrderDateBetween(startDateTime, endDateTime);
    }
}
