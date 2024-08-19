package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.dto.UserDto;
import com.cogent.shop_for_home_spring_boot.entity.User;

import java.util.List;

public interface UserService {

    List<UserDto> getAllUsers();

    List<UserDto> getAllActiveUsers();

    User getById(Long id);

    User getByEmail(String email);

    User saveUser(UserDto user);

    void deleteUserById(Long id);
}
