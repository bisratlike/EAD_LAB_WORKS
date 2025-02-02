package com.urent.urent.repository;

import com.urent.urent.models.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RatingRepository extends MongoRepository<Rating, String> {
    List<Rating> findByItemId(String itemId);
}