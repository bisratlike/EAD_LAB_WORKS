package com.urent.urent.service;

import com.urent.urent.dto.BookmarkDTO;
import com.urent.urent.dto.ItemDTO;
import com.urent.urent.exception.BookmarkExistsException;
import com.urent.urent.exception.BookmarkNotFoundException;
import com.urent.urent.exception.ItemNotFoundException;
import com.urent.urent.exception.UnauthorizedException;
import com.urent.urent.models.Bookmark;
import com.urent.urent.models.Item;
import com.urent.urent.models.User;
import com.urent.urent.repository.BookmarkRepository;
import com.urent.urent.repository.ItemRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final ItemRepository itemRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository, ItemRepository itemRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.itemRepository = itemRepository;
    }

    public BookmarkDTO addBookmark(String itemId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // Check if item exists
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found"));
        
        // Check if bookmark exists
        if (bookmarkRepository.existsByUserIdAndItemId(user.getId(), itemId)) {
            throw new BookmarkExistsException("Item already bookmarked");
        }
        
        Bookmark bookmark = new Bookmark();
        bookmark.setUserId(user.getId());
        bookmark.setItemId(itemId);
        bookmark.setBookmarkedAt(LocalDateTime.now());
        
        Bookmark savedBookmark = bookmarkRepository.save(bookmark);
        return mapToDTO(savedBookmark);
    }

    public void removeBookmark(String bookmarkId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> new BookmarkNotFoundException("Bookmark not found"));
        
        if (!bookmark.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized to delete this bookmark");
        }
        
        bookmarkRepository.delete(bookmark);
    }

    public List<BookmarkDTO> getUserBookmarks() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return bookmarkRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BookmarkDTO mapToDTO(Bookmark bookmark) {
        Item item = itemRepository.findById(bookmark.getItemId())
                .orElseThrow(() -> new ItemNotFoundException("Item not found for bookmark: " + bookmark.getId()));
        
        return BookmarkDTO.builder()
                .id(bookmark.getId())
                .userId(bookmark.getUserId())
                .itemId(bookmark.getItemId())
                .item(mapItemToDTO(item))
                .bookmarkedAt(bookmark.getBookmarkedAt())
                .build();
    }

    private ItemDTO mapItemToDTO(Item item) {
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
}