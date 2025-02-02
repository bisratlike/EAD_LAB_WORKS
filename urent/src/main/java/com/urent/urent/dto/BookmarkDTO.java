package com.urent.urent.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkDTO {
    private String id;
    private String userId;
    private String itemId;
    private ItemDTO item;  
    private LocalDateTime bookmarkedAt;
}