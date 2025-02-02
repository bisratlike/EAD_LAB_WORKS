package com.urent.urent.repository;

import com.urent.urent.models.Item;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ItemRepository extends MongoRepository<Item, String> {
    List<Item> findByOwnerId(String ownerId);
    // In ItemRepository.java
List<Item> findByTitleContainingIgnoreCase(String searchTerm);
}