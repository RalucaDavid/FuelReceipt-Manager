package com.example.fuel.receipt.manager.dtos;

import com.example.fuel.receipt.manager.enums.FuelType;
import com.example.fuel.receipt.manager.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReceiptRequestDTO(
        @NotBlank String cif,
        @NotBlank String receiptNumber,
        @NotNull FuelType fuelType,
        @NotNull PaymentMethod paymentMethod,
        @NotNull @Positive BigDecimal total,
        @NotNull LocalDateTime date
) {}
