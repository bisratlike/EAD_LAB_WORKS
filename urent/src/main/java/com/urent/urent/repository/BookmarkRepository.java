package com.urent.urent.repository;

import com.urent.urent.models.Bookmark;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookmarkRepository extends MongoRepository<Bookmark, String> {
    List<Bookmark> findByUserId(String userId);
    boolean existsByUserIdAndItemId(String userId, String itemId);
}