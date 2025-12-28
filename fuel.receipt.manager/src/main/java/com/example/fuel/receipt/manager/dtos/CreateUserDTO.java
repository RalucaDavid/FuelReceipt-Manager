package com.example.fuel.receipt.manager.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserDTO(
        @NotBlank
        String firstName,

        @NotBlank
        String lastName,

        @Email
        @NotBlank
        String email,

        @NotBlank
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password
) {
}
