package com.example.fuel.receipt.manager.controllers;

import com.example.fuel.receipt.manager.dtos.ReceiptRequestDTO;
import com.example.fuel.receipt.manager.dtos.ReceiptResponseDTO;
import com.example.fuel.receipt.manager.entities.Receipt;
import com.example.fuel.receipt.manager.services.interfaces.ReceiptService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${application.api.path}/receipts")
public class ReceiptController {
    private final ReceiptService receiptService;

    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createReceipt(@Valid @RequestBody ReceiptRequestDTO dto) {
        receiptService.createReceipt(dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<ReceiptResponseDTO>> getReceipts() {
        return ResponseEntity.ok(receiptService.getAllMyReceipts());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ReceiptResponseDTO> getReceipt(@PathVariable UUID id) {
        return ResponseEntity.ok(receiptService.getReceiptById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateReceipt(
            @PathVariable UUID id,
            @Valid @RequestBody ReceiptRequestDTO dto) {
        receiptService.updateReceipt(id, dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable UUID id) {
        receiptService.deleteReceipt(id);
        return ResponseEntity.noContent().build();
    }
}
