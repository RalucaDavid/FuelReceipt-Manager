package com.example.fuel.receipt.manager.dtos;

import com.example.fuel.receipt.manager.enums.Role;

import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String firstName,
        String lastName,
        String email,
        Role role
) {
}
