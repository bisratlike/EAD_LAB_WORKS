package com.urent.urent.models;
import com.urent.urent.models.enums.Availability;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {
    @Id
    private String id; // Changed to String for MongoDB

    private String title;
    private String description;
    private Double price;
    private List<String> photos;

    @Builder.Default
    private Availability availability = Availability.AVAILABLE;

    private String ownerId; // Reference to User (owner)

    private List<Rating> ratings; // Embedded documents
    private List<Comment> comments; // Embedded documents

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;


    // Add in Item.java
@Transient // Not stored in MongoDB
private Double averageRating;

public Double getAverageRating() {
    return ratings.stream()
            .mapToDouble(Rating::getRating)
            .average()
            .orElse(0.0);
}
}