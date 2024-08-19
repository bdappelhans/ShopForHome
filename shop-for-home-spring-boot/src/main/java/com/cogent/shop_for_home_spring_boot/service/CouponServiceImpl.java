package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.entity.Coupon;
import com.cogent.shop_for_home_spring_boot.repository.CouponRepository;
import com.cogent.shop_for_home_spring_boot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CouponServiceImpl implements CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    public List<Coupon> getActiveCoupons() {
        return couponRepository.findByIsActiveTrue();
    }

    @Override
    public Coupon getCouponById(Long id) {
        return couponRepository.findById(id).orElse(null);
    }

    @Override
    public Coupon saveCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    @Override
    public Coupon updateCoupon(Coupon coupon) {
        Coupon foundCoupon = getCouponById(coupon.getId());

        if (foundCoupon == null) { // if coupon isn't found, print a message and return null
            System.out.println("Coupon " + coupon.getId() + " not found");
            return null;
        } else {
            if (!coupon.isActive()) { // if coupon is being deactivated

                // Save the updated coupon
                couponRepository.save(coupon);
            }
            return couponRepository.save(coupon);
        }
    }

}
