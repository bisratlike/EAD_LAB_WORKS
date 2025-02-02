package com.urent.urent.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class PasswordResetDTO {
    @NotBlank
    private String email;
    
    @NotBlank
    private String newPassword;
    
    @NotBlank
    private String resetToken;
}