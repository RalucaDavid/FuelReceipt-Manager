package com.example.fuel.receipt.manager.repositories;

import com.example.fuel.receipt.manager.entities.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    List<Vehicle> findByUserId(UUID userId);
    Optional<Vehicle> findByIdAndUserId(UUID id, UUID userId);
    boolean existsByLicensePlateAndUserId(String licensePlate, UUID userId);
}
