package com.cogent.shop_for_home_spring_boot.controller;

import com.cogent.shop_for_home_spring_boot.entity.User;
import com.cogent.shop_for_home_spring_boot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/email/{userEmail}")
    public User getUserByEmail(@PathVariable String userEmail) {
        User foundUser = userService.getByEmail(userEmail);

        if (foundUser == null) {
            System.out.println("User with email " + userEmail + " not found");
        }

        return foundUser;
    }

    @GetMapping("/id/{userId}")
    public User getUserById(@PathVariable Long userId) {
        User foundUser = userService.getById(userId);

        if (foundUser == null) {
            System.out.println("User with id " + userId + " not found");
        }

        return foundUser;
    }
}
