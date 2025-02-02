package com.urent.urent.controller;

import com.urent.urent.dto.CommentDTO;
import com.urent.urent.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/{itemId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addComment(
            @PathVariable String itemId,
            @RequestBody CommentDTO commentDTO
    ) {
        commentService.addComment(itemId, commentDTO);
    }
}