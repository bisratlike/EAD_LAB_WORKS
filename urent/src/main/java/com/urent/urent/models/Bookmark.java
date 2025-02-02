package com.urent.urent.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "bookmarks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bookmark {
    @Id
    private String id; // Changed to String for MongoDB

    private String userId; // Reference to User
    private String itemId; // Reference to Item

    @CreatedDate
    private LocalDateTime bookmarkedAt;
}