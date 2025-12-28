package com.example.fuel.receipt.manager.repositories;

import com.example.fuel.receipt.manager.entities.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    User save(User user);
    Optional<User> findById(UUID id);
}
