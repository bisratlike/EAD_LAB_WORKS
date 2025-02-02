package com.urent.urent.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateDTO {
    private String name;
    private String profilePicture;
    private String bio;
    private Long phoneNumber;
}