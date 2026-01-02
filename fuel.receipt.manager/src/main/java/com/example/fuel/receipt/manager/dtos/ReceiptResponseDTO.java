package com.example.fuel.receipt.manager.dtos;

import com.example.fuel.receipt.manager.enums.FuelType;
import com.example.fuel.receipt.manager.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReceiptResponseDTO(
        UUID id,

        @NotBlank
        String cif,

        @NotBlank
        String receiptNumber,

        FuelType fuelType,
        PaymentMethod paymentMethod,

        @NotBlank
        BigDecimal total,

        LocalDateTime date
) {}
