package com.urent.urent.controller;

import com.urent.urent.dto.BookmarkDTO;
import com.urent.urent.service.BookmarkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping("/{itemId}")
    public ResponseEntity<BookmarkDTO> addBookmark(@PathVariable String itemId) {
        return new ResponseEntity<>(bookmarkService.addBookmark(itemId), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BookmarkDTO>> getBookmarks() {
        return ResponseEntity.ok(bookmarkService.getUserBookmarks());
    }

    @DeleteMapping("/{bookmarkId}")
    public ResponseEntity<Void> removeBookmark(@PathVariable String bookmarkId) {
        bookmarkService.removeBookmark(bookmarkId);
        return ResponseEntity.noContent().build();
    }
}