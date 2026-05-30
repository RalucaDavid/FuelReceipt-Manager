package com.example.fuel.receipt.manager.services.interfaces;

import com.example.fuel.receipt.manager.dtos.VehicleRequestDTO;
import com.example.fuel.receipt.manager.dtos.VehicleResponseDTO;

import java.util.List;
import java.util.UUID;

public interface VehicleService {
    List<VehicleResponseDTO> getMyVehicles();
    VehicleResponseDTO createVehicle(VehicleRequestDTO dto);
    VehicleResponseDTO updateVehicle(UUID id, VehicleRequestDTO dto);
    void deleteVehicle(UUID id);
}
