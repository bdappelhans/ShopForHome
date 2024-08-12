package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.entity.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    User getById(Long id);

    User getByEmail(String email);

    User saveUser(User user);

    void deleteUserById(Long id);
}
