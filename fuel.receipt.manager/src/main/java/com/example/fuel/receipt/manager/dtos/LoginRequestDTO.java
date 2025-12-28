package com.example.fuel.receipt.manager.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequestDTO(
        @Email
        @NotBlank
        String email,

        @NotBlank
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password
) {
}
