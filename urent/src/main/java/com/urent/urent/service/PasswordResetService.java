// File: src/main/java/com/urent/urent/service/PasswordResetService.java
package com.urent.urent.service;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// Correct import
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
// import com.github.benmanes.caffeine.cache.Cache;
import com.urent.urent.dto.PasswordResetDTO;
import com.urent.urent.exception.InvalidTokenException;
import com.urent.urent.models.User;
import com.urent.urent.repository.UserRepository;

import lombok.SneakyThrows;

@Service
public class PasswordResetService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
   
    @Autowired
    public PasswordResetService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }
    private final Cache<String, String> resetTokens = 
        Caffeine.newBuilder().expireAfterWrite(1, TimeUnit.HOURS).build();

    @SneakyThrows
    public void initiateReset(String email) {
        userRepository.findByEmail(email)
            .ifPresent(user -> {
                String token = UUID.randomUUID().toString();
                resetTokens.put(token, email);
                emailService.sendPasswordResetEmail(email, token);
            });
    }

    public void completeReset(PasswordResetDTO resetDTO) {
        String email = resetTokens.getIfPresent(resetDTO.getResetToken());
        if (email == null) throw new InvalidTokenException("Invalid reset token");
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        user.setPassword(passwordEncoder.encode(resetDTO.getNewPassword()));
        userRepository.save(user);
        resetTokens.invalidate(resetDTO.getResetToken());
    }
}