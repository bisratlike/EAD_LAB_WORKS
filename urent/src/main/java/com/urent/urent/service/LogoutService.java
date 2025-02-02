package com.urent.urent.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class LogoutService {
    private final Cache<String, Boolean> tokenBlocklist = 
        Caffeine.newBuilder()
                .expireAfterWrite(24, TimeUnit.HOURS)
                .build();

    public void logout(String token) {
        tokenBlocklist.put(token, true);
    }

    public boolean isTokenInvalid(String token) {
        return tokenBlocklist.getIfPresent(token) != null;
    }
}