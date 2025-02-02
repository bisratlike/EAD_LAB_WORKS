package com.urent.urent.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
    @Id
    private String id; // Changed to String for MongoDB

    private String userId; // Reference to User
    private String itemId; // Reference to Item
    private String content;
    private LocalDateTime timestamp;
}