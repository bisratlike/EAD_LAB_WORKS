package com.urent.urent.dto;

import com.urent.urent.models.enums.Availability;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter

public class ItemRequestDTO {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    private Double price;
    private MultipartFile image; // Keep this for the image upload
    private Availability availability;
}