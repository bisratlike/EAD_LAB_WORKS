package com.urent.urent.controller;

import com.urent.urent.dto.UserDTO;
import com.urent.urent.dto.UserUpdateDTO;
import com.urent.urent.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMyProfile() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(
        @Valid @RequestBody UserUpdateDTO updateDTO
    ) {
        return ResponseEntity.ok(userService.updateUserProfile(updateDTO));
    }
}