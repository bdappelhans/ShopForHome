package com.cogent.shop_for_home_spring_boot.controller;

import com.cogent.shop_for_home_spring_boot.dto.UserDto;
import com.cogent.shop_for_home_spring_boot.entity.User;
import com.cogent.shop_for_home_spring_boot.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> authenticatedUser() {
        System.out.println("Attempting to grab user details");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();
        System.out.println("Grabbing user: " + currentUser);
        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDto> getActiveUsers() {
        return userService.getAllActiveUsers();
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
    @PreAuthorize("hasRole('ADMIN')")
    public UserDto getUserById(@PathVariable Long userId) {
        User foundUser = userService.getById(userId);

        if (foundUser == null) {
            System.out.println("User with id " + userId + " not found");
            return null;
        } else {
            return new UserDto(foundUser);
        }
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public UserDto updateUser(@RequestBody UserDto userDto) {
        User foundUser = userService.getById(userDto.getId());

        if (foundUser == null) {
            System.out.println("User with id " + userDto.getId() + " not found");
            return null;
        } else {
            return new UserDto(userService.saveUser(userDto));
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
