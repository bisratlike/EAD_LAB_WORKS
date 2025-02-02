package com.urent.urent.service;

import org.springframework.stereotype.Service;

@Service
public class DummyEmailService implements EmailService {
    @Override
    public void sendPasswordResetEmail(String email, String token) {
        System.out.println("[Mock] Password reset email sent to " + email + " with token: " + token);
    }

    @Override
    public void sendConfirmationEmail(String email) {
        System.out.println("[Mock] Confirmation email sent to " + email);
    }
}