package com.urent.urent.service;

import com.urent.urent.dto.CommentDTO;
import com.urent.urent.exception.ItemNotFoundException;
import com.urent.urent.models.Comment;
import com.urent.urent.models.User;
import com.urent.urent.repository.CommentRepository;
import com.urent.urent.repository.ItemRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final ItemRepository itemRepository;

    public CommentService(CommentRepository commentRepository, ItemRepository itemRepository) {
        this.commentRepository = commentRepository;
        this.itemRepository = itemRepository;
    }

    public void addComment(String itemId, CommentDTO commentDTO) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        itemRepository.findById(itemId)
            .orElseThrow(() -> new ItemNotFoundException("Item not found"));
        
        Comment comment = new Comment();
        comment.setUserId(user.getId());
        comment.setItemId(itemId);
        comment.setContent(commentDTO.getContent());
        comment.setTimestamp(LocalDateTime.now());
        commentRepository.save(comment);
    }
}