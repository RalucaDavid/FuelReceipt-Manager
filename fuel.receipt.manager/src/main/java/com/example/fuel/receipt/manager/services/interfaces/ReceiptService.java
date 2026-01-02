package com.example.fuel.receipt.manager.services.interfaces;

import com.example.fuel.receipt.manager.dtos.ReceiptRequestDTO;
import com.example.fuel.receipt.manager.dtos.ReceiptResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ReceiptService {
    void createReceipt(ReceiptRequestDTO dto);
    List<ReceiptResponseDTO> getAllMyReceipts();
    void deleteReceipt(UUID id);
    ReceiptResponseDTO getReceiptById(UUID id);
    void updateReceipt(UUID id, ReceiptRequestDTO dto);
}
