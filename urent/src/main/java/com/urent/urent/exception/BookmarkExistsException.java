package com.urent.urent.exception;

public class BookmarkExistsException extends RuntimeException {
    public BookmarkExistsException(String message) {
        super(message);
    }
}