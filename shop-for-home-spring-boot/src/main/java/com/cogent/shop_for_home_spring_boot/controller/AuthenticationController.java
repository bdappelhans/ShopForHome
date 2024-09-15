package com.cogent.shop_for_home_spring_boot.controller;

import com.cogent.shop_for_home_spring_boot.dto.LoginUserDto;
import com.cogent.shop_for_home_spring_boot.dto.RegisterUserDto;
import com.cogent.shop_for_home_spring_boot.entity.Order;
import com.cogent.shop_for_home_spring_boot.entity.User;
import com.cogent.shop_for_home_spring_boot.response.LoginResponse;
import com.cogent.shop_for_home_spring_boot.service.AuthenticationService;
import com.cogent.shop_for_home_spring_boot.service.JwtService;
import com.cogent.shop_for_home_spring_boot.service.OrderService;
import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")  // Base URL for authentication-related endpoints
@RestController  // Marks this class as a REST controller
@CrossOrigin(origins = "*")  // Allows requests from any origin
public class AuthenticationController {
    private final JwtService jwtService;  // Service for JWT operations
    private final AuthenticationService authenticationService;  // Service for user authentication

    @Autowired
    private OrderService orderService;  // Service for managing orders (auto-wired)

    // Constructor for dependency injection
    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    // Endpoint for user registration
    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        // Register the new user and get the registered user object
        User registeredUser = authenticationService.signup(registerUserDto);

        if (registeredUser != null) {
            // Create a new order for the registered user
            Order newOrder = new Order();
            newOrder.setUserId(registeredUser.getId());
            orderService.createOrder(newOrder);
        }

        // Return the registered user in the response
        return ResponseEntity.ok(registeredUser);
    }

    // Endpoint for user login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        System.out.println(loginUserDto);  // Print login details to the console (for debugging)

        // Authenticate the user and get the authenticated user object
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        // Generate a JWT token for the authenticated user
        String jwtToken = jwtService.generateToken(authenticatedUser);

        // Prepare the login response with token and expiration time
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());

        // Return the login response with token details
        return ResponseEntity.ok(loginResponse);
    }
}
