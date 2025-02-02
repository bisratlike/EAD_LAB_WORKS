// src/main/java/com/urent/urent/exception/InvalidCredentialsException.java
package com.urent.urent.exception;

public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}