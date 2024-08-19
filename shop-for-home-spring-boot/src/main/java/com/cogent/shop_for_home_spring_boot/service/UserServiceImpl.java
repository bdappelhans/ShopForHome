package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.dto.UserDto;
import com.cogent.shop_for_home_spring_boot.entity.User;
import com.cogent.shop_for_home_spring_boot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findByIsAdminFalse();
        List<UserDto> userDtos = new ArrayList<>();

        for (User user : users) {
            UserDto userDto = new UserDto(user);
            userDtos.add(userDto);
        }

        return userDtos;
    }

    @Override
    public List<UserDto> getAllActiveUsers() {
        List<User> users = userRepository.findByIsAdminFalseAndIsActiveTrue();
        List<UserDto> userDtos = new ArrayList<>();

        for (User user : users) {
            UserDto userDto = new UserDto(user);
            userDtos.add(userDto);
        }

        return userDtos;
    }

    @Override
    public User getById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User getByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public User saveUser(UserDto userDto) {
        System.out.println("Attempting to update user " + userDto.getId());
        User user = getById(userDto.getId());
        user.setId(userDto.getId());
        user.setEmail(userDto.getEmail());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setAddress(userDto.getAddress());
        user.setCoupon(userDto.getCoupon());
        user.setActive(userDto.isActive());

        return userRepository.save(user);
    }

    @Override
    public void deleteUserById(Long id) {
        userRepository.deleteById(id);
        System.out.println("User " + id + " deleted");
    }
}
