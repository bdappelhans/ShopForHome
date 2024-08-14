package com.cogent.shop_for_home_spring_boot.controller;

import com.cogent.shop_for_home_spring_boot.entity.User;
import com.cogent.shop_for_home_spring_boot.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();

        return ResponseEntity.ok(currentUser);
    }

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

    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        user.setId(0L);

        return userService.saveUser(user);
    }

    @PutMapping("/update")
    public User updateUser(@RequestBody User user) {
        User foundUser = userService.getById(user.getId());

        if (foundUser == null) {
            System.out.println("User with id " + user.getId() + " not found");
            return null;
        } else {
            return userService.saveUser(user);
        }
    }

    @DeleteMapping("/delete/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        User foundUser = userService.getById(userId);

        if (foundUser == null) {
            System.out.println("User with id " + userId + " not found");
        } else {
            userService.deleteUserById(userId);
        }
    }
}
