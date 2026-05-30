package com.example.fuel.receipt.manager.services.interfaces;

import com.example.fuel.receipt.manager.dtos.ClientResponseDTO;
import com.example.fuel.receipt.manager.dtos.InviteAccountantDTO;
import com.example.fuel.receipt.manager.dtos.ReceiptRequestDTO;
import com.example.fuel.receipt.manager.dtos.ReceiptResponseDTO;
import com.example.fuel.receipt.manager.dtos.VehicleResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ClientService {
    void inviteAccountant(InviteAccountantDTO dto);
    List<ClientResponseDTO> getMyClients();
    List<VehicleResponseDTO> getClientVehicles(UUID clientId);
    List<ReceiptResponseDTO> getClientVehicleReceipts(UUID clientId, UUID vehicleId);
    void removeClient(UUID clientId);
    List<ClientResponseDTO> getMyAccountants();
    void removeAccountant(UUID accountantId);
    void createReceiptForClient(UUID clientId, ReceiptRequestDTO dto);
    void updateReceiptForClient(UUID clientId, UUID receiptId, ReceiptRequestDTO dto);
    void deleteReceiptForClient(UUID clientId, UUID receiptId);
}
