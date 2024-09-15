package com.cogent.shop_for_home_spring_boot.controller;

import com.cogent.shop_for_home_spring_boot.entity.Coupon;
import com.cogent.shop_for_home_spring_boot.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "*")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping("/all")
    public List<Coupon> getAllCoupons() {
        return couponService.getAllCoupons();
    }

    @GetMapping("/active")
    public List<Coupon> getActiveCoupons() {
        return couponService.getActiveCoupons();
    }

    @GetMapping("/{couponId}")
    public Coupon getCouponById(@PathVariable Long couponId) {
        Coupon foundCoupon = couponService.getCouponById(couponId);

        if (foundCoupon == null) {
            System.out.println("Coupon " + couponId + " not found");
        }
        return foundCoupon;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public Coupon addCoupon(@RequestBody Coupon coupon) {
        coupon.setId(0L);
        coupon.setActive(true);
        return couponService.saveCoupon(coupon);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public Coupon updateCoupon(@RequestBody Coupon coupon) {
        return couponService.updateCoupon(coupon);
    }

}
