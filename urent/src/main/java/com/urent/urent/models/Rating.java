package com.urent.urent.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {
    private String userId;
    private String itemId;
    private Double rating;
    private LocalDateTime createdAt;
}