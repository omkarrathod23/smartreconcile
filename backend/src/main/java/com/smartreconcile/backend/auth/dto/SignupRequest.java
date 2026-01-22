package com.smartreconcile.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username; // kept for legacy reasons if needed, but we use email mostly

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    private Set<String> role;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    private String fullName;
}
