package com.urent.urent.service;

import com.urent.urent.dto.LoginRequestDTO;
import com.urent.urent.dto.SignupDTO;
import com.urent.urent.dto.UserDTO;
import com.urent.urent.dto.UserUpdateDTO;
import com.urent.urent.exception.EmailExistsException;
import com.urent.urent.exception.InvalidCredentialsException;
import com.urent.urent.models.User;
import com.urent.urent.repository.UserRepository;
import com.urent.urent.utils.JwtUtils;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils, @Lazy AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    // Other methods remain unchanged


    public UserDTO signup(SignupDTO signupDTO) {
        if (userRepository.existsByEmail(signupDTO.getEmail())) {
            throw new EmailExistsException("Email already exists");
        }

        User user = new User();
        user.setName(signupDTO.getName());
        user.setEmail(signupDTO.getEmail());
        user.setPassword(passwordEncoder.encode(signupDTO.getPassword()));
        user.setProfilePicture(signupDTO.getProfilePicture());
        user.setBio(signupDTO.getBio());
        user.setPhoneNumber(signupDTO.getPhoneNumber());

        User savedUser = userRepository.save(user);
        return mapToDTO(savedUser);
    }

   public Map<String, Object> login(LoginRequestDTO loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        )
    );
    
    SecurityContextHolder.getContext().setAuthentication(authentication);
    User user = (User) authentication.getPrincipal();
    String token = jwtUtils.generateToken(user);
    
    Map<String, Object> response = new HashMap<>();
    response.put("token", token);
    response.put("user", user);
    
    return response;
}

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public String deleteAccount(String id) {
        userRepository.deleteById(id);
        return "Account deleted successfully";
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .build();
    }

    // In UserService.java
public UserDTO getCurrentUserProfile() {
    User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return mapToFullDTO(currentUser);
}

public UserDTO updateUserProfile(UserUpdateDTO updateDTO) {
    User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    
    currentUser.setName(updateDTO.getName());
    currentUser.setProfilePicture(updateDTO.getProfilePicture());
    currentUser.setBio(updateDTO.getBio());
    currentUser.setPhoneNumber(updateDTO.getPhoneNumber());
    
    User updatedUser = userRepository.save(currentUser);
    return mapToFullDTO(updatedUser);
}

private UserDTO mapToFullDTO(User user) {
    return UserDTO.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .profilePicture(user.getProfilePicture())
            .bio(user.getBio())
            .phoneNumber(user.getPhoneNumber())
            .trustScore(user.getTrustScore())
            .build();
}
}