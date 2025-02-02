package com.urent.urent.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.util.List;

@Document(collection = "chats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chat {
    @Id
    private String id; // Changed to String for MongoDB

    private List<String> participantIds; // Reference to User IDs
    private List<Message> messages; // Embedded documents
}