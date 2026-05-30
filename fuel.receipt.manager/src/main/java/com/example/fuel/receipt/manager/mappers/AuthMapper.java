package com.example.fuel.receipt.manager.mappers;

import com.example.fuel.receipt.manager.dtos.CreateUserDTO;
import com.example.fuel.receipt.manager.dtos.UserResponseDTO;
import com.example.fuel.receipt.manager.entities.User;

public class AuthMapper {
    private AuthMapper() {
        throw new UnsupportedOperationException("This class should never be instantiated");
    }

    public static User fromDto(final CreateUserDTO createUserDto) {
        return User.builder()
                .email(createUserDto.email())
                .firstName(createUserDto.firstName())
                .lastName(createUserDto.lastName())
                .role(createUserDto.role())
                .build();
    }

    public static UserResponseDTO toDto(final User user) {
        return new UserResponseDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole());
    }
}