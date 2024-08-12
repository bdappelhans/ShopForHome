package com.cogent.shop_for_home_spring_boot.repository;

import com.cogent.shop_for_home_spring_boot.entity.Coupon;
import com.cogent.shop_for_home_spring_boot.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Custom query method to find products that are active
    List<Product> findByIsActiveTrue();
}
