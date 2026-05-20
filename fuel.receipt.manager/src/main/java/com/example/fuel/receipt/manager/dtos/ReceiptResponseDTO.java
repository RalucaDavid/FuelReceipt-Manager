package com.example.fuel.receipt.manager.dtos;

import com.example.fuel.receipt.manager.enums.FuelType;
import com.example.fuel.receipt.manager.enums.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ReceiptResponseDTO(
        UUID id,
        String cif,
        String receiptNumber,
        FuelType fuelType,
        PaymentMethod paymentMethod,
        BigDecimal total,
        LocalDateTime date
) {}
