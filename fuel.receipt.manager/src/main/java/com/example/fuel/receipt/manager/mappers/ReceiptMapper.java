package com.example.fuel.receipt.manager.mappers;

import com.example.fuel.receipt.manager.dtos.ReceiptRequestDTO;
import com.example.fuel.receipt.manager.dtos.ReceiptResponseDTO;
import com.example.fuel.receipt.manager.entities.Receipt;
import com.example.fuel.receipt.manager.entities.User;
import com.example.fuel.receipt.manager.entities.Vehicle;

public class ReceiptMapper {

    private ReceiptMapper() {
        throw new UnsupportedOperationException("This class should never be instantiated");
    }

    public static Receipt fromDto(final ReceiptRequestDTO dto, final User user, final Vehicle vehicle) {
        return Receipt.builder()
                .cif(dto.cif())
                .receiptNumber(dto.receiptNumber())
                .fuelType(dto.fuelType())
                .paymentMethod(dto.paymentMethod())
                .total(dto.total())
                .date(dto.date())
                .user(user)
                .vehicle(vehicle)
                .build();
    }

    public static ReceiptResponseDTO toDto(final Receipt receipt) {
        Vehicle v = receipt.getVehicle();
        return new ReceiptResponseDTO(
                receipt.getId(),
                receipt.getCif(),
                receipt.getReceiptNumber(),
                receipt.getFuelType(),
                receipt.getPaymentMethod(),
                receipt.getTotal(),
                receipt.getDate(),
                v != null ? v.getId() : null,
                v != null ? v.getLicensePlate() : null
        );
    }
}
