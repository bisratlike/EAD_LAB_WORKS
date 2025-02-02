// File: src/main/java/com/urent/urent/controller/RatingController.java
package com.urent.urent.controller;

import com.urent.urent.dto.RatingDTO;
import com.urent.urent.service.RatingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping("/{itemId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addRating(
            @PathVariable String itemId,
            @RequestBody RatingDTO ratingDTO
    ) {
        ratingService.addRating(itemId, ratingDTO);
    }
}