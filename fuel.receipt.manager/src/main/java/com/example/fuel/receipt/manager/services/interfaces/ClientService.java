package com.example.fuel.receipt.manager.services.interfaces;

import com.example.fuel.receipt.manager.dtos.ClientResponseDTO;
import com.example.fuel.receipt.manager.dtos.InviteAccountantDTO;
import com.example.fuel.receipt.manager.dtos.ReceiptResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ClientService {
    void inviteAccountant(InviteAccountantDTO dto);
    List<ClientResponseDTO> getMyClients();
    List<ReceiptResponseDTO> getClientReceipts(UUID clientId);
    void removeClient(UUID clientId);
    List<ClientResponseDTO> getMyAccountants();
    void removeAccountant(UUID accountantId);
}
