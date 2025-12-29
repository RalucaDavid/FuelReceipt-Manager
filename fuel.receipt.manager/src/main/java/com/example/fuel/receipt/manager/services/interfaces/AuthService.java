package com.example.fuel.receipt.manager.services.interfaces;

import com.example.fuel.receipt.manager.dtos.CreateUserDTO;
import com.example.fuel.receipt.manager.dtos.LoginRequestDTO;
import com.example.fuel.receipt.manager.dtos.UserResponseDTO;
import com.example.fuel.receipt.manager.entities.User;

import java.util.UUID;

public interface AuthService {
    String login(LoginRequestDTO loginRequestDTO);
    void createUser(CreateUserDTO createUserDto);
    UserResponseDTO getUserByEmail(String email);
}
