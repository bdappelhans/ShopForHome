package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.entity.WishList;

import java.util.List;

public interface WishListService {

    List<WishList> findByUserId(Long userId);

    WishList save(WishList wishList);

    void remove(WishList wishList);
}
