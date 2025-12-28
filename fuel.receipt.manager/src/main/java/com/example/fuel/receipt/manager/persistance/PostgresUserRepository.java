package com.example.fuel.receipt.manager.persistance;

import com.example.fuel.receipt.manager.entities.User;
import com.example.fuel.receipt.manager.repositories.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PostgresUserRepository extends JpaRepository<User, UUID>, UserRepository {
}
