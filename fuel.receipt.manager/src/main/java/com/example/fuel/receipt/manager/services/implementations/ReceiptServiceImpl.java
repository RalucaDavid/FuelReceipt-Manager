package com.example.fuel.receipt.manager.services.implementations;

import com.example.fuel.receipt.manager.dtos.ReceiptRequestDTO;
import com.example.fuel.receipt.manager.dtos.ReceiptResponseDTO;
import com.example.fuel.receipt.manager.entities.Receipt;
import com.example.fuel.receipt.manager.entities.User;
import com.example.fuel.receipt.manager.entities.Vehicle;
import com.example.fuel.receipt.manager.exceptions.AccessForbiddenException;
import com.example.fuel.receipt.manager.exceptions.ResourceNotFoundException;
import com.example.fuel.receipt.manager.mappers.ReceiptMapper;
import com.example.fuel.receipt.manager.repositories.ReceiptRepository;
import com.example.fuel.receipt.manager.repositories.UserRepository;
import com.example.fuel.receipt.manager.repositories.VehicleRepository;
import com.example.fuel.receipt.manager.services.interfaces.ReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReceiptServiceImpl implements ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Vehicle getVehicleForCurrentUser(UUID vehicleId) {
        User user = getCurrentUser();
        return vehicleRepository.findByIdAndUserId(vehicleId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
    }

    @Override
    @Transactional
    public void createReceipt(ReceiptRequestDTO dto) {
        Vehicle vehicle = getVehicleForCurrentUser(dto.vehicleId());
        Receipt receipt = ReceiptMapper.fromDto(dto, getCurrentUser(), vehicle);
        receiptRepository.save(receipt);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReceiptResponseDTO> getAllMyReceipts() {
        return receiptRepository.findByUserIdOrderByDateDesc(getCurrentUser().getId())
                .stream()
                .map(ReceiptMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void deleteReceipt(UUID id) {
        String email = getCurrentUser().getEmail();
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found"));

        if (!receipt.getUser().getEmail().equals(email)) {
            throw new AccessForbiddenException("You are not authorized to delete this receipt");
        }

        receiptRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ReceiptResponseDTO getReceiptById(UUID id) {
        String email = getCurrentUser().getEmail();
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found"));

        if (!receipt.getUser().getEmail().equals(email)) {
            throw new AccessForbiddenException("You are not authorized to view this receipt");
        }

        return ReceiptMapper.toDto(receipt);
    }

    @Override
    @Transactional
    public void updateReceipt(UUID id, ReceiptRequestDTO dto) {
        String email = getCurrentUser().getEmail();
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found"));

        if (!receipt.getUser().getEmail().equals(email)) {
            throw new AccessForbiddenException("You are not authorized to update this receipt");
        }

        receipt.setCif(dto.cif());
        receipt.setReceiptNumber(dto.receiptNumber());
        receipt.setFuelType(dto.fuelType());
        receipt.setPaymentMethod(dto.paymentMethod());
        receipt.setTotal(dto.total());
        receipt.setDate(dto.date());
        receipt.setVehicle(getVehicleForCurrentUser(dto.vehicleId()));

        receiptRepository.save(receipt);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReceiptResponseDTO> getAllMyReceiptsByMonth(int year, int month) {
        return receiptRepository.findByUserIdAndYearAndMonth(getCurrentUser().getId(), year, month)
                .stream()
                .map(ReceiptMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReceiptResponseDTO> getAllMyReceiptsByVehicle(UUID vehicleId) {
        vehicleRepository.findByIdAndUserId(vehicleId, getCurrentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        return receiptRepository.findByVehicleIdOrderByDateDesc(vehicleId)
                .stream()
                .map(ReceiptMapper::toDto)
                .toList();
    }
}
