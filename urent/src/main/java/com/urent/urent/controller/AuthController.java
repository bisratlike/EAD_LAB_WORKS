package com.urent.urent.controller;

import com.urent.urent.dto.*;
import com.urent.urent.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final LogoutService logoutService;
    private final PasswordResetService passwordResetService;

    // 1. Fixed constructor injection
    @Autowired
    public AuthController(
        UserService userService,
        LogoutService logoutService,
        PasswordResetService passwordResetService
    ) {
        this.userService = userService;
        this.logoutService = logoutService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(@Valid @RequestBody SignupDTO signupDTO) {
        return ResponseEntity.ok(userService.signup(signupDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        return ResponseEntity.ok(userService.login(loginRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable String id) {
        return ResponseEntity.ok(Map.of(
            "message", userService.deleteAccount(id)
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
        @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.substring(7);
        logoutService.logout(token);
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        passwordResetService.initiateReset(email);
        return ResponseEntity.ok(Map.of("message", "Reset email sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody PasswordResetDTO resetDTO) {
        passwordResetService.completeReset(resetDTO);
        return ResponseEntity.ok(Map.of("message", "Password updated"));
    }
}