package com.cogent.shop_for_home_spring_boot.repository;

import com.cogent.shop_for_home_spring_boot.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Custom query method to find orders that are placed
    List<Order> findByIsPlacedTrue();

    // Custom query method to find all orders by user ID
    List<Order> findByUserId(Long userId);

    // Custom query method to find all placed orders by user ID
    List<Order> findByUserIdAndIsPlacedTrue(Long userId);

    // Custom query method to find all placed orders by user ID
    List<Order> findByUserIdAndIsPlacedFalse(Long userId);
}
