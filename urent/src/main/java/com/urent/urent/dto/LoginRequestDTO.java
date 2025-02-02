// LoginRequestDTO.java
package com.urent.urent.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor // Add this
@AllArgsConstructor
public class LoginRequestDTO {
    private String email;
    private String password;
}