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

@RequestMapping("/auth")
@RestController
@CrossOrigin(origins = "*")
public class AuthenticationController {
    private final JwtService jwtService;

    @Autowired
    private OrderService orderService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);

        if (registeredUser != null) {
            Order newOrder = new Order();
            newOrder.setUserId(registeredUser.getId());
            orderService.createOrder(newOrder);
        }

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        System.out.println(loginUserDto);
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }
}