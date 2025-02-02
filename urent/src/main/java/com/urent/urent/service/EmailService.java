package com.urent.urent.service;

public interface EmailService {
    void sendPasswordResetEmail(String email, String token);
    void sendConfirmationEmail(String email); // Add this if needed
}