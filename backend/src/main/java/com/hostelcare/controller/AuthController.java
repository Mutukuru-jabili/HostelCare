package com.hostelcare.controller;

import com.hostelcare.dto.ApiResponse;
import com.hostelcare.dto.AuthRequest;
import com.hostelcare.dto.RegisterRequest;
import com.hostelcare.entity.User;
import com.hostelcare.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Registration successful", user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody AuthRequest request) {
        User user = userService.login(request);
        return ResponseEntity.ok(new ApiResponse(true, "Login successful", user));
    }
}
