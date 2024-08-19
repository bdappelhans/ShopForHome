package com.cogent.shop_for_home_spring_boot.controller;

import com.cogent.shop_for_home_spring_boot.entity.WishList;
import com.cogent.shop_for_home_spring_boot.service.WishListService;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wish")
public class WishController {

    @Autowired
    private WishListService wishListService;

    @GetMapping("/{userId}/all")
    public List<WishList> getWishListByUserId(@PathVariable Long userId) {
        return wishListService.findByUserId(userId);
    }

    @PostMapping("/add")
    public WishList addWishList(@RequestBody WishList wishList) {
        return wishListService.save(wishList);
    }

    @DeleteMapping("/remove")
    public void removeWishList(@RequestBody WishList wishList) {
        wishListService.remove(wishList);
    }

}
