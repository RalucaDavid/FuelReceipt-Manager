package com.example.fuel.receipt.manager.dtos;

import java.util.UUID;

public record ClientResponseDTO(
        UUID id,
        String firstName,
        String lastName,
        String email
) {
}
