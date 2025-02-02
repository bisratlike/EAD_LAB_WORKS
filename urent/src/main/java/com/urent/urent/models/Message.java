package com.urent.urent.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.time.LocalDateTime;

@Document(collection = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    private String id; // Changed to String for MongoDB

    private String senderId; // Reference to User
    private String chatId; // Reference to Chat
    private String content;
    private LocalDateTime timestamp;
}