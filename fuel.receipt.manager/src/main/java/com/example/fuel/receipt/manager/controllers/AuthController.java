package com.example.fuel.receipt.manager.controllers;

import com.example.fuel.receipt.manager.dtos.CreateUserDTO;
import com.example.fuel.receipt.manager.dtos.LoginRequestDTO;
import com.example.fuel.receipt.manager.services.interfaces.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${application.api.path}/auth")
public class AuthController {

    private final AuthService authService;

    @Value("${application.security.cookie.name}")
    private String cookieName;

    @Value("${application.security.cookie.max-age}")
    private int maxAge;

    @Value("${application.security.cookie.http-only}")
    private boolean httpOnly;

    @Value("${application.security.cookie.secure}")
    private boolean secure;

    @Value("${application.security.cookie.same-site}")
    private String sameSite;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> createUser(@RequestBody @Valid CreateUserDTO createUserDto) {
        authService.createUser(createUserDto);
        return ResponseEntity.status(201).body("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody @Valid LoginRequestDTO loginRequestDTO) {
        final String token = authService.login(loginRequestDTO);
        ResponseCookie cookie = ResponseCookie.from(cookieName, token)
                .httpOnly(httpOnly)
                .secure(secure)
                .path("/")
                .maxAge(maxAge)
                .sameSite(sameSite)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = ResponseCookie.from(cookieName, "")
                .httpOnly(httpOnly)
                .secure(secure)
                .path("/")
                .maxAge(0)
                .sameSite(sameSite)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
}