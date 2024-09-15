package com.cogent.shop_for_home_spring_boot.service;

import com.cogent.shop_for_home_spring_boot.dto.LoginUserDto;
import com.cogent.shop_for_home_spring_boot.dto.RegisterUserDto;
import com.cogent.shop_for_home_spring_boot.entity.User;
import com.cogent.shop_for_home_spring_boot.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;  // Repository for interacting with user data
    private final PasswordEncoder passwordEncoder;  // Encoder for hashing user passwords
    private final AuthenticationManager authenticationManager;  // Manager for handling authentication

    // Constructor for dependency injection
    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Method for user registration
    public User signup(RegisterUserDto input) {
        User user = new User();
        user.setFirstName(input.getFirstName());  // Set user's first name
        user.setLastName(input.getLastName());  // Set user's last name
        user.setEmail(input.getEmail());  // Set user's email
        user.setPassword(passwordEncoder.encode(input.getPassword()));  // Encode and set user's password
        user.setActive(true);  // Mark user as active

        return userRepository.save(user);  // Save the new user to the repository and return it
    }

    // Method for user authentication
    public User authenticate(LoginUserDto input) {
        // Attempt authentication with provided email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        // Retrieve and return the user from the repository based on email
        return userRepository.findByEmail(input.getEmail())
                .orElseThrow();  // Throw exception if user not found
    }
}

