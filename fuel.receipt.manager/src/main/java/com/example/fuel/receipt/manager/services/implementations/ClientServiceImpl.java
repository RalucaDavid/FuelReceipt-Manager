package com.example.fuel.receipt.manager.services.implementations;

import com.example.fuel.receipt.manager.dtos.ClientResponseDTO;
import com.example.fuel.receipt.manager.dtos.InviteAccountantDTO;
import com.example.fuel.receipt.manager.dtos.ReceiptRequestDTO;
import com.example.fuel.receipt.manager.dtos.ReceiptResponseDTO;
import com.example.fuel.receipt.manager.dtos.VehicleResponseDTO;
import com.example.fuel.receipt.manager.entities.AccountantClient;
import com.example.fuel.receipt.manager.entities.Receipt;
import com.example.fuel.receipt.manager.entities.User;
import com.example.fuel.receipt.manager.entities.Vehicle;
import com.example.fuel.receipt.manager.enums.Role;
import com.example.fuel.receipt.manager.exceptions.AccessForbiddenException;
import com.example.fuel.receipt.manager.exceptions.ResourceNotFoundException;
import com.example.fuel.receipt.manager.mappers.ReceiptMapper;
import com.example.fuel.receipt.manager.repositories.AccountantClientRepository;
import com.example.fuel.receipt.manager.repositories.ReceiptRepository;
import com.example.fuel.receipt.manager.repositories.UserRepository;
import com.example.fuel.receipt.manager.repositories.VehicleRepository;
import com.example.fuel.receipt.manager.services.interfaces.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final AccountantClientRepository accountantClientRepository;
    private final UserRepository userRepository;
    private final ReceiptRepository receiptRepository;
    private final VehicleRepository vehicleRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public void inviteAccountant(InviteAccountantDTO dto) {
        User company = getCurrentUser();
        if (company.getRole() != Role.COMPANY) {
            throw new AccessForbiddenException("Only companies can invite accountants");
        }

        User accountant = userRepository.findByEmail(dto.accountantEmail())
                .orElseThrow(() -> new UsernameNotFoundException("No user found with email: " + dto.accountantEmail()));

        if (accountant.getRole() != Role.ACCOUNTANT) {
            throw new IllegalArgumentException("The user is not an accountant");
        }

        if (accountantClientRepository.existsByAccountantIdAndCompanyId(accountant.getId(), company.getId())) {
            throw new IllegalArgumentException("This accountant is already linked to your company");
        }

        accountantClientRepository.save(AccountantClient.builder()
                .accountant(accountant)
                .company(company)
                .build());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientResponseDTO> getMyClients() {
        User accountant = getCurrentUser();
        if (accountant.getRole() != Role.ACCOUNTANT) {
            throw new AccessForbiddenException("Only accountants can view their clients");
        }

        return accountantClientRepository.findByAccountantId(accountant.getId())
                .stream()
                .map(link -> new ClientResponseDTO(
                        link.getCompany().getId(),
                        link.getCompany().getFirstName(),
                        link.getCompany().getLastName(),
                        link.getCompany().getEmail()
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> getClientVehicles(UUID clientId) {
        User accountant = getCurrentUser();
        if (accountant.getRole() != Role.ACCOUNTANT) {
            throw new AccessForbiddenException("Only accountants can view client vehicles");
        }
        if (!accountantClientRepository.existsByAccountantIdAndCompanyId(accountant.getId(), clientId)) {
            throw new AccessForbiddenException("You are not linked to this company");
        }
        return vehicleRepository.findByUserId(clientId)
                .stream()
                .map(v -> new VehicleResponseDTO(v.getId(), v.getLicensePlate(), v.getBrand(), v.getModel(), v.getYear(), v.getVin()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReceiptResponseDTO> getClientVehicleReceipts(UUID clientId, UUID vehicleId) {
        User accountant = getCurrentUser();
        if (accountant.getRole() != Role.ACCOUNTANT) {
            throw new AccessForbiddenException("Only accountants can view client receipts");
        }
        if (!accountantClientRepository.existsByAccountantIdAndCompanyId(accountant.getId(), clientId)) {
            throw new AccessForbiddenException("You are not linked to this company");
        }
        return receiptRepository.findByUserIdAndVehicleIdOrderByDateDesc(clientId, vehicleId)
                .stream()
                .map(ReceiptMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void removeClient(UUID clientId) {
        User accountant = getCurrentUser();
        if (accountant.getRole() != Role.ACCOUNTANT) {
            throw new AccessForbiddenException("Only accountants can remove clients");
        }

        if (!accountantClientRepository.existsByAccountantIdAndCompanyId(accountant.getId(), clientId)) {
            throw new AccessForbiddenException("You are not linked to this company");
        }

        accountantClientRepository.deleteByAccountantIdAndCompanyId(accountant.getId(), clientId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientResponseDTO> getMyAccountants() {
        User company = getCurrentUser();
        if (company.getRole() != Role.COMPANY) {
            throw new AccessForbiddenException("Only companies can view their accountants");
        }

        return accountantClientRepository.findByCompanyId(company.getId())
                .stream()
                .map(link -> new ClientResponseDTO(
                        link.getAccountant().getId(),
                        link.getAccountant().getFirstName(),
                        link.getAccountant().getLastName(),
                        link.getAccountant().getEmail()
                ))
                .toList();
    }

    @Override
    @Transactional
    public void removeAccountant(UUID accountantId) {
        User company = getCurrentUser();
        if (company.getRole() != Role.COMPANY) {
            throw new AccessForbiddenException("Only companies can remove accountants");
        }

        if (!accountantClientRepository.existsByAccountantIdAndCompanyId(accountantId, company.getId())) {
            throw new AccessForbiddenException("This accountant is not linked to your company");
        }

        accountantClientRepository.deleteByAccountantIdAndCompanyId(accountantId, company.getId());
    }

    @Override
    @Transactional
    public void createReceiptForClient(UUID clientId, ReceiptRequestDTO dto) {
        User accountant = getCurrentUser();
        if (accountant.getRole() != Role.ACCOUNTANT) {
            throw new AccessForbiddenException("Only accountants can create receipts for clients");
        }
        if (!accountantClientRepository.existsByAccountantIdAndCompanyId(accountant.getId(), clientId)) {
            throw new AccessForbiddenException("You are not linked to this company");
        }

        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(dto.vehicleId(), clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        receiptRepository.save(ReceiptMapper.fromDto(dto, client, vehicle));
    }

    @Override
    @Transactional
    public void updateReceiptForClient(UUID clientId, UUID receiptId, ReceiptRequestDTO dto) {
        User accountant = getCurrentUser();
        if (accountant.getRole() != Role.ACCOUNTANT) {
            throw new AccessForbiddenException("Only accountants can update client receipts");
        }
        if (!accountantClientRepository.existsByAccountantIdAndCompanyId(accountant.getId(), clientId)) {
            throw new AccessForbiddenException("You are not linked to this company");
        }

        Receipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found"));
        if (!receipt.getUser().getId().equals(clientId)) {
            throw new AccessForbiddenException("This receipt does not belong to this client");
        }

        Vehicle vehicle = vehicleRepository.findByIdAndUserId(dto.vehicleId(), clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        receipt.setCif(dto.cif());
        receipt.setReceiptNumber(dto.receiptNumber());
        receipt.setFuelType(dto.fuelType());
        receipt.setPaymentMethod(dto.paymentMethod());
        receipt.setTotal(dto.total());
        receipt.setDate(dto.date());
        receipt.setVehicle(vehicle);
        receiptRepository.save(receipt);
    }

    @Override
    @Transactional
    public void deleteReceiptForClient(UUID clientId, UUID receiptId) {
        User accountant = getCurrentUser();
        if (accountant.getRole() != Role.ACCOUNTANT) {
            throw new AccessForbiddenException("Only accountants can delete client receipts");
        }
        if (!accountantClientRepository.existsByAccountantIdAndCompanyId(accountant.getId(), clientId)) {
            throw new AccessForbiddenException("You are not linked to this company");
        }

        Receipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found"));
        if (!receipt.getUser().getId().equals(clientId)) {
            throw new AccessForbiddenException("This receipt does not belong to this client");
        }

        receiptRepository.deleteById(receiptId);
    }
}
