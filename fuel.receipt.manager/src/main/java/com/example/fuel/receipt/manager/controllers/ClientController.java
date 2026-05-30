package com.example.fuel.receipt.manager.controllers;

import com.example.fuel.receipt.manager.dtos.ClientResponseDTO;
import com.example.fuel.receipt.manager.dtos.InviteAccountantDTO;
import com.example.fuel.receipt.manager.dtos.ReceiptResponseDTO;
import com.example.fuel.receipt.manager.dtos.VehicleResponseDTO;
import com.example.fuel.receipt.manager.services.interfaces.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${application.api.path}/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping("/invite")
    public ResponseEntity<Void> inviteAccountant(@Valid @RequestBody InviteAccountantDTO dto) {
        clientService.inviteAccountant(dto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ClientResponseDTO>> getMyClients() {
        return ResponseEntity.ok(clientService.getMyClients());
    }

    @GetMapping("/{clientId}/vehicles")
    public ResponseEntity<List<VehicleResponseDTO>> getClientVehicles(@PathVariable UUID clientId) {
        return ResponseEntity.ok(clientService.getClientVehicles(clientId));
    }

    @GetMapping("/{clientId}/vehicles/{vehicleId}/receipts")
    public ResponseEntity<List<ReceiptResponseDTO>> getClientVehicleReceipts(
            @PathVariable UUID clientId,
            @PathVariable UUID vehicleId) {
        return ResponseEntity.ok(clientService.getClientVehicleReceipts(clientId, vehicleId));
    }

    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> removeClient(@PathVariable UUID clientId) {
        clientService.removeClient(clientId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/accountants")
    public ResponseEntity<List<ClientResponseDTO>> getMyAccountants() {
        return ResponseEntity.ok(clientService.getMyAccountants());
    }

    @DeleteMapping("/accountants/{accountantId}")
    public ResponseEntity<Void> removeAccountant(@PathVariable UUID accountantId) {
        clientService.removeAccountant(accountantId);
        return ResponseEntity.noContent().build();
    }
}
