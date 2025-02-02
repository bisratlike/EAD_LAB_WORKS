// File: src/main/java/com/urent/urent/exception/InvalidTokenException.java
package com.urent.urent.exception;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException(String message) {
        super(message);
    }
}