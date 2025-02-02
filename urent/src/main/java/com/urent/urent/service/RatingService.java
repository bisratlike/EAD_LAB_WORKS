package com.urent.urent.service;

import com.urent.urent.dto.RatingDTO;
import com.urent.urent.exception.ItemNotFoundException;
import com.urent.urent.models.Rating;
import com.urent.urent.models.User;
import com.urent.urent.repository.RatingRepository;
import com.urent.urent.repository.ItemRepository;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class RatingService {
    private final RatingRepository ratingRepository;
    private final ItemRepository itemRepository;

    public RatingService(RatingRepository ratingRepository, ItemRepository itemRepository) {
        this.ratingRepository = ratingRepository;
        this.itemRepository = itemRepository;
    }

    public void addRating(String itemId, RatingDTO ratingDTO) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        itemRepository.findById(itemId)
            .orElseThrow(() -> new ItemNotFoundException("Item not found"));
        
        Rating rating = new Rating();
        rating.setUserId(user.getId());
        rating.setItemId(itemId);
        rating.setRating(ratingDTO.getRating());
        ratingRepository.save(rating);
    }

    // Add in RatingService.java
    public Double getAverageRating(String itemId) {
        List<Rating> ratings = ratingRepository.findByItemId(itemId);
        return ratings.stream()
                .mapToDouble(Rating::getRating)
                .average()
                .orElse(0.0);
    }
}