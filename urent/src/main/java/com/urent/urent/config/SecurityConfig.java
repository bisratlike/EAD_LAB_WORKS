package com.urent.urent.config;

import com.urent.urent.repository.UserRepository;
import com.urent.urent.security.JwtAuthEntryPoint;
import com.urent.urent.security.JwtAuthFilter;
import com.urent.urent.service.LogoutService;
import com.urent.urent.service.UserService;
import com.urent.urent.utils.JwtUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthEntryPoint authEntryPoint;
    private final @Lazy UserService userService;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfig(JwtAuthEntryPoint authEntryPoint, @Lazy UserService userService, PasswordEncoder passwordEncoder) {
        this.authEntryPoint = authEntryPoint;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .exceptionHandling(handling -> handling.authenticationEntryPoint(authEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/signup", "/api/auth/login").permitAll()
                .requestMatchers("/api/auth/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/items/**").permitAll()
                .requestMatchers("/api/items/**").authenticated()
                .requestMatchers("/api/bookmarks/**").authenticated()
                .requestMatchers("/ws-chat/**").permitAll()
                .requestMatchers("/U/**", "/*.html", "/*.js", "/*.css", "/assets/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter(JwtUtils jwtUtils, LogoutService logoutService, UserService userService) {
        return new JwtAuthFilter(jwtUtils, userService, logoutService);
    }
}