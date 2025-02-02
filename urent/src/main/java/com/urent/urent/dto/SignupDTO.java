package com.urent.urent.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class SignupDTO implements Serializable { // Implement Serializable
    private static final long serialVersionUID = 1L; // Add a serialVersionUID

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    private String profilePicture;

    private String bio;

    private Double trustScore = 5.0; // Default trust score

    @Min(100000000)
    private Long phoneNumber; // Changed to Long to handle larger phone numbers
}