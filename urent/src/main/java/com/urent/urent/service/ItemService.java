package com.urent.urent.service;

import com.urent.urent.dto.ItemDTO;
import com.urent.urent.dto.ItemRequestDTO;
import com.urent.urent.dto.RatingDTO;
import com.urent.urent.exception.ItemNotFoundException;

import com.urent.urent.models.Item;
import com.urent.urent.models.Rating;
import com.urent.urent.models.User;
import com.urent.urent.repository.ItemRepository;
import com.urent.urent.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.io.IOException;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    @Autowired
    private UserRepository userRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public ItemDTO createItem(ItemRequestDTO itemRequest, String base64Image) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Item item = new Item();
        item.setTitle(itemRequest.getTitle());
        item.setDescription(itemRequest.getDescription());
        item.setPrice(itemRequest.getPrice());
        item.setPhotos(Collections.singletonList(base64Image)); // Store the Base64 image
        item.setAvailability(itemRequest.getAvailability());
        item.setOwnerId(currentUser.getId());
        
        Item savedItem = itemRepository.save(item);
        return mapToDTO(savedItem);
    }

    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<ItemDTO> getUserItems() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return itemRepository.findByOwnerId(currentUser.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ItemDTO getItemById(String id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Item not found"));
        
        // Fetch owner information
        User owner = userRepository.findById(item.getOwnerId())
        .orElseThrow(() -> new UsernameNotFoundException("Owner not found"));
// .
        ItemDTO itemDTO = mapToDTO(item);
        itemDTO.setOwnerName(owner.getName());
        itemDTO.setOwnerProfilePicture(owner.getProfilePicture());
        
        return itemDTO;
    }

    public ItemDTO updateItem(String id, ItemRequestDTO itemRequest) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + id));

        if (!existingItem.getOwnerId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to update this item");
        }

        existingItem.setTitle(itemRequest.getTitle());
        existingItem.setDescription(itemRequest.getDescription());
        existingItem.setPrice(itemRequest.getPrice());

        // Only update the image if provided
        if (itemRequest.getImage() != null && !itemRequest.getImage().isEmpty()) {
            String base64Image = convertImageToBase64(itemRequest.getImage());
            existingItem.setPhotos(Collections.singletonList(base64Image)); // Store the Base64 image
        }

        existingItem.setAvailability(itemRequest.getAvailability());
        Item updatedItem = itemRepository.save(existingItem);
        return mapToDTO(updatedItem);
    }

    public ItemDTO addRating(String itemId, RatingDTO ratingDTO) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found"));
    
        Rating rating = new Rating();
        rating.setUserId(currentUser.getId());
        rating.setRating(ratingDTO.getRating());
        rating.setCreatedAt(LocalDateTime.now());

        if (item.getRatings() == null) {
            item.setRatings(new ArrayList<>());
        }

        // Remove existing rating by this user if exists
        item.getRatings().removeIf(r -> r.getUserId().equals(currentUser.getId()));
        item.getRatings().add(rating);

        Item savedItem = itemRepository.save(item);
        return mapToDTO(savedItem);
    }

    // Add this method to convert image to Base64
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

    public void deleteItem(String id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Item existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + id));
        if (!existingItem.getOwnerId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized to delete this item");
        }
        itemRepository.delete(existingItem);
    }

    private ItemDTO mapToDTO(Item item) {
        return ItemDTO.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .price(item.getPrice())
                .photos(item.getPhotos())
                .availability(item.getAvailability())
                .ownerId(item.getOwnerId())
                .build();
    }

    public List<ItemDTO> searchItems(String query) {
        return itemRepository.findByTitleContainingIgnoreCase(query)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}