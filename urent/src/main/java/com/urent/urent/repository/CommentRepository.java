package com.urent.urent.repository;

import com.urent.urent.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByItemId(String itemId);
}