package com.example.fuel.receipt.manager.dtos;

public record OcrResponseDTO(
        String cif,
        String date,
        String receiptNumber,
        String fuelType,
        String paymentMethod,
        String total
) {}
