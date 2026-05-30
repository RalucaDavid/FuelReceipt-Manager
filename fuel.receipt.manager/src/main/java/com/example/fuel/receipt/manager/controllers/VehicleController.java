package com.example.fuel.receipt.manager.controllers;

import com.example.fuel.receipt.manager.dtos.VehicleRequestDTO;
import com.example.fuel.receipt.manager.dtos.VehicleResponseDTO;
import com.example.fuel.receipt.manager.services.interfaces.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${application.api.path}/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<VehicleResponseDTO>> getMyVehicles() {
        return ResponseEntity.ok(vehicleService.getMyVehicles());
    }

    @PostMapping
    public ResponseEntity<VehicleResponseDTO> createVehicle(@Valid @RequestBody VehicleRequestDTO dto) {
        return new ResponseEntity<>(vehicleService.createVehicle(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponseDTO> updateVehicle(@PathVariable UUID id, @Valid @RequestBody VehicleRequestDTO dto) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable UUID id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
