package com.example.fuel.receipt.manager.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record InviteAccountantDTO(
        @Email
        @NotBlank
        String accountantEmail
) {
}
