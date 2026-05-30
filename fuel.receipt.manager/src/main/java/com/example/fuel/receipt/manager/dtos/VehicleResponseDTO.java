package com.example.fuel.receipt.manager.dtos;

import java.util.UUID;

public record VehicleResponseDTO(
        UUID id,
        String licensePlate,
        String brand,
        String model,
        Integer year,
        String vin
) {}
