package com.urent.urent.controller;
import com.urent.urent.service.RatingService;
import com.urent.urent.dto.ItemDTO;
import com.urent.urent.dto.ItemRequestDTO;
import com.urent.urent.dto.RatingDTO; // Import RatingDTO
import com.urent.urent.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    public ResponseEntity<ItemDTO> createItem(@Valid @ModelAttribute ItemRequestDTO itemRequest) {
        // Convert image to Base64
        String base64Image = convertImageToBase64(itemRequest.getImage()); // Convert here
    
        // Create the item with the Base64 image
        ItemDTO itemDTO = itemService.createItem(itemRequest, base64Image); // Pass Base64 image
    
        return new ResponseEntity<>(itemDTO, HttpStatus.CREATED);
    }
private String convertImageToBase64(MultipartFile image) {
    if (image.isEmpty()) {
        throw new RuntimeException("Failed to upload image: no file provided");
    }

    try {
        byte[] bytes = image.getBytes();
        return Base64.getEncoder().encodeToString(bytes); // Convert to Base64
    } catch (IOException e) {
        throw new RuntimeException("Failed to convert image to Base64: " + e.getMessage());
    }
}

    @GetMapping
    public ResponseEntity<List<ItemDTO>> getAllItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> getItem(@PathVariable String id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ItemDTO> updateItem(@PathVariable String id, @Valid @ModelAttribute ItemRequestDTO itemRequest) {
        return ResponseEntity.ok(itemService.updateItem(id, itemRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }


    // In ItemController.java
@GetMapping("/search")
public ResponseEntity<List<ItemDTO>> searchByTitle(@RequestParam String query) {
    return ResponseEntity.ok(itemService.searchItems(query));
}


// In ItemController.java@Autowired
private RatingService ratingService;

@GetMapping("/{id}/average-rating")
public ResponseEntity<Double> getAverageRating(@PathVariable String id) {
    return ResponseEntity.ok(ratingService.getAverageRating(id));
}

    @GetMapping("/my-items")
    public ResponseEntity<List<ItemDTO>> getUserItems() {
        try {
            List<ItemDTO> items = itemService.getUserItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            // Log the error and return an appropriate response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{id}/rate")
    public ResponseEntity<ItemDTO> rateItem(@PathVariable String id, @Valid @RequestBody RatingDTO ratingDTO) {
        ItemDTO ratedItem = itemService.addRating(id, ratingDTO);
        return ResponseEntity.ok(ratedItem);
    }
}