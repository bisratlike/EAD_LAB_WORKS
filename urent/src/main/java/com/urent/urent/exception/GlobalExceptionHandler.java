package com.urent.urent.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle validation errors (e.g., @Valid failures)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse response = new ErrorResponse();
        response.setTimestamp(LocalDateTime.now());
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setError("Validation Error");
        response.setMessage("Validation failed");
        response.setDetails(errors);
        response.setPath(request.getDescription(false).replace("uri=", ""));

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Handle business logic exceptions
    @ExceptionHandler({EmailExistsException.class, InvalidCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleBusinessExceptions(RuntimeException ex, WebRequest request) {
        ErrorResponse response = new ErrorResponse();
        response.setTimestamp(LocalDateTime.now());
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setError("Business Rule Violation");
        response.setMessage(ex.getMessage());
        response.setPath(request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Handle database constraint violations
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(WebRequest request) {
        ErrorResponse response = new ErrorResponse();
        response.setTimestamp(LocalDateTime.now());
        response.setStatus(HttpStatus.CONFLICT.value());
        response.setError("Data Conflict");
        response.setMessage("Database constraint violation");
        response.setPath(request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    // Global fallback for all other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex, WebRequest request) {
        ErrorResponse response = new ErrorResponse();
        response.setTimestamp(LocalDateTime.now());
        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setError("Internal Server Error");
        response.setMessage(ex.getMessage()); // Only include message in development
        response.setPath(request.getDescription(false).replace("uri=", ""));
        
        // Log the exception here
        ex.printStackTrace();
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }



    @ExceptionHandler(ItemNotFoundException.class)
public ResponseEntity<ErrorResponse> handleItemNotFound(ItemNotFoundException ex, WebRequest request) {
    ErrorResponse response = new ErrorResponse();
    response.setTimestamp(LocalDateTime.now());
    response.setStatus(HttpStatus.NOT_FOUND.value());
    response.setError("Not Found");
    response.setMessage(ex.getMessage());
    response.setPath(request.getDescription(false).replace("uri=", ""));
    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
}

@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ErrorResponse> handleUnauthorized(RuntimeException ex, WebRequest request) {
    ErrorResponse response = new ErrorResponse();
    response.setTimestamp(LocalDateTime.now());
    response.setStatus(HttpStatus.FORBIDDEN.value());
    response.setError("Forbidden");
    response.setMessage(ex.getMessage());
    response.setPath(request.getDescription(false).replace("uri=", ""));
    return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
}

// Add these handlers to GlobalExceptionHandler.java
@ExceptionHandler(BookmarkExistsException.class)
public ResponseEntity<ErrorResponse> handleBookmarkExists(BookmarkExistsException ex, WebRequest request) {
    ErrorResponse response = new ErrorResponse();
    response.setTimestamp(LocalDateTime.now());
    response.setStatus(HttpStatus.CONFLICT.value());
    response.setError("Conflict");
    response.setMessage(ex.getMessage());
    response.setPath(request.getDescription(false).replace("uri=", ""));
    return new ResponseEntity<>(response, HttpStatus.CONFLICT);
}

@ExceptionHandler(UnauthorizedException.class)
public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex, WebRequest request) {
    ErrorResponse response = new ErrorResponse();
    response.setTimestamp(LocalDateTime.now());
    response.setStatus(HttpStatus.FORBIDDEN.value());
    response.setError("Forbidden");
    response.setMessage(ex.getMessage());
    response.setPath(request.getDescription(false).replace("uri=", ""));
    return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
}
}