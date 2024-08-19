package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.entity.WishList;
import com.cogent.shop_for_home_spring_boot.repository.WishListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishListServiceImpl implements WishListService {

    @Autowired
    private WishListRepository wishListRepository;


    @Override
    public List<WishList> findByUserId(Long userId) {
        return wishListRepository.findById_UserId(userId);
    }

    @Override
    public WishList save(WishList wishList) {
        return wishListRepository.save(wishList);
    }

    @Override
    public void remove(WishList wishList) {
        wishListRepository.delete(wishList);
    }
}
