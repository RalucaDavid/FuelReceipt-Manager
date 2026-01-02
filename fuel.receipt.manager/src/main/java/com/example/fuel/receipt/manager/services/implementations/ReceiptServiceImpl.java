package com.example.fuel.receipt.manager.services.implementations;

import com.example.fuel.receipt.manager.dtos.ReceiptRequestDTO;
import com.example.fuel.receipt.manager.dtos.ReceiptResponseDTO;
import com.example.fuel.receipt.manager.entities.Receipt;
import com.example.fuel.receipt.manager.entities.User;
import com.example.fuel.receipt.manager.mappers.ReceiptMapper;
import com.example.fuel.receipt.manager.repositories.ReceiptRepository;
import com.example.fuel.receipt.manager.repositories.UserRepository;
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

    @Override
    @Transactional
    public void createReceipt(ReceiptRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Receipt receipt = ReceiptMapper.fromDto(dto, user);
        receiptRepository.save(receipt);
    }

    @Override
    public List<ReceiptResponseDTO> getAllMyReceipts() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return receiptRepository.findByUserIdOrderByDateDesc(user.getId())
                .stream()
                .map(ReceiptMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public void deleteReceipt(UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));

        if (!receipt.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You are not authorized to delete this receipt");
        }

        receiptRepository.deleteById(id);
    }

    @Override
    public ReceiptResponseDTO getReceiptById(UUID id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));

        if (!receipt.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You are not authorized to view this receipt");
        }

        return ReceiptMapper.toDto(receipt);
    }

    @Override
    @Transactional
    public void updateReceipt(UUID id, ReceiptRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Receipt receipt = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Receipt not found"));

        if (!receipt.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You are not authorized to update this receipt");
        }

        receipt.setCif(dto.cif());
        receipt.setReceiptNumber(dto.receiptNumber());
        receipt.setFuelType(dto.fuelType());
        receipt.setPaymentMethod(dto.paymentMethod());
        receipt.setTotal(dto.total());
        receipt.setDate(dto.date());

        receiptRepository.save(receipt);
    }
}
