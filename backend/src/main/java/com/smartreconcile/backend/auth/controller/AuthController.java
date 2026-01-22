package com.smartreconcile.backend.auth.controller;

import com.smartreconcile.backend.auth.dto.JwtResponse;
import com.smartreconcile.backend.auth.dto.LoginRequest;
import com.smartreconcile.backend.auth.dto.MessageResponse;
import com.smartreconcile.backend.auth.dto.SignupRequest;
import com.smartreconcile.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthService authService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        MessageResponse response = authService.registerUser(signUpRequest);
        if (response.getMessage().contains("Error")) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
