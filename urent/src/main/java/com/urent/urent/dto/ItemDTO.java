package com.urent.urent.dto;

import com.urent.urent.models.enums.Availability;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemDTO {
    private String id;
    private String title;
    private String description;
    private Double price;
    private List<String> photos;
    private Availability availability;
    private String ownerId;
    private String ownerName;
    private String ownerProfilePicture;
}