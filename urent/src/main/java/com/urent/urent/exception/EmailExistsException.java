// src/main/java/com/urent/urent/exception/EmailExistsException.java
package com.urent.urent.exception;
public class EmailExistsException extends RuntimeException {
    public EmailExistsException(String message) {
        super(message);
    }
}