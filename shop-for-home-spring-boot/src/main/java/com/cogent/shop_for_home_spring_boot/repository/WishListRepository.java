package com.cogent.shop_for_home_spring_boot.repository;

import com.cogent.shop_for_home_spring_boot.entity.WishList;
import com.cogent.shop_for_home_spring_boot.entity.WishListId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishListRepository extends JpaRepository<WishList, WishListId> {

    // Custom method to find all WishList items by userId
    List<WishList> findById_UserId(Long userId);
}
