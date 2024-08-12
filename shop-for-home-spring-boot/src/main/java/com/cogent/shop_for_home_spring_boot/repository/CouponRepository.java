package com.cogent.shop_for_home_spring_boot.repository;

import com.cogent.shop_for_home_spring_boot.entity.Coupon;
import com.cogent.shop_for_home_spring_boot.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

    // Custom query method to find coupons that are active
    List<Coupon> findByIsActiveTrue();
}
