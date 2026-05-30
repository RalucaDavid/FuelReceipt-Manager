package com.example.fuel.receipt.manager.dtos;

import jakarta.validation.constraints.NotBlank;

public record VehicleRequestDTO(
        @NotBlank String licensePlate,
        String brand,
        String model,
        Integer year,
        String vin
) {}
