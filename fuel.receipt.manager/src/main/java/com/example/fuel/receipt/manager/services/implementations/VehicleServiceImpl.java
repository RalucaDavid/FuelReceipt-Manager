package com.example.fuel.receipt.manager.services.implementations;

import com.example.fuel.receipt.manager.dtos.VehicleRequestDTO;
import com.example.fuel.receipt.manager.dtos.VehicleResponseDTO;
import com.example.fuel.receipt.manager.entities.User;
import com.example.fuel.receipt.manager.entities.Vehicle;
import com.example.fuel.receipt.manager.exceptions.AccessForbiddenException;
import com.example.fuel.receipt.manager.exceptions.ResourceNotFoundException;
import com.example.fuel.receipt.manager.repositories.UserRepository;
import com.example.fuel.receipt.manager.repositories.VehicleRepository;
import com.example.fuel.receipt.manager.services.interfaces.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private VehicleResponseDTO toDto(Vehicle v) {
        return new VehicleResponseDTO(v.getId(), v.getLicensePlate(), v.getBrand(), v.getModel(), v.getYear(), v.getVin());
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponseDTO> getMyVehicles() {
        return vehicleRepository.findByUserId(getCurrentUser().getId())
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional
    public VehicleResponseDTO createVehicle(VehicleRequestDTO dto) {
        User user = getCurrentUser();
        if (vehicleRepository.existsByLicensePlateAndUserId(dto.licensePlate(), user.getId())) {
            throw new IllegalArgumentException("A vehicle with this license plate already exists");
        }
        Vehicle vehicle = Vehicle.builder()
                .licensePlate(dto.licensePlate())
                .brand(dto.brand())
                .model(dto.model())
                .year(dto.year())
                .vin(dto.vin())
                .user(user)
                .build();
        return toDto(vehicleRepository.save(vehicle));
    }

    @Override
    @Transactional
    public VehicleResponseDTO updateVehicle(UUID id, VehicleRequestDTO dto) {
        User user = getCurrentUser();
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (!vehicle.getLicensePlate().equals(dto.licensePlate()) &&
                vehicleRepository.existsByLicensePlateAndUserId(dto.licensePlate(), user.getId())) {
            throw new IllegalArgumentException("A vehicle with this license plate already exists");
        }

        vehicle.setLicensePlate(dto.licensePlate());
        vehicle.setBrand(dto.brand());
        vehicle.setModel(dto.model());
        vehicle.setYear(dto.year());
        vehicle.setVin(dto.vin());
        return toDto(vehicleRepository.save(vehicle));
    }

    @Override
    @Transactional
    public void deleteVehicle(UUID id) {
        User user = getCurrentUser();
        Vehicle vehicle = vehicleRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        vehicleRepository.delete(vehicle);
    }
}
