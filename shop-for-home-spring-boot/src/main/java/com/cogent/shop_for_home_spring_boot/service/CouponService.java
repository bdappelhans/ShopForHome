package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.entity.Coupon;

import java.util.List;

public interface CouponService {

    List<Coupon> getAllCoupons();

    List<Coupon> getActiveCoupons();

    Coupon getCouponById(Long id);

    Coupon saveCoupon(Coupon coupon);

    Coupon updateCoupon(Coupon coupon);
}
