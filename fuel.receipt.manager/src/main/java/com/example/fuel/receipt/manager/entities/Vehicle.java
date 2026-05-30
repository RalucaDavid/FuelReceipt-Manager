package com.example.fuel.receipt.manager.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @UuidGenerator(style = UuidGenerator.Style.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String licensePlate;

    private String brand;
    private String model;
    private Integer year;
    private String vin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
