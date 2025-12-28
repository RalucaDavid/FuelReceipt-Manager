package com.example.fuel.receipt.manager.mappers;

import com.example.fuel.receipt.manager.dtos.CreateUserDTO;
import com.example.fuel.receipt.manager.dtos.LoginRequestDTO;
import com.example.fuel.receipt.manager.dtos.UserResponseDTO;
import com.example.fuel.receipt.manager.entities.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

public class AuthMapper {
    private AuthMapper() {
        throw new UnsupportedOperationException("This class should never be instantiated");
    }

    public static User fromDto(final CreateUserDTO createUserDto) {
        return User.builder()
                .email(createUserDto.email())
                .firstName(createUserDto.firstName())
                .lastName(createUserDto.lastName())
                .build();
    }

    public static Authentication fromDto(final LoginRequestDTO loginRequestDTO) {
        return new UsernamePasswordAuthenticationToken(loginRequestDTO.email(), loginRequestDTO.password());
    }

    public static UserResponseDTO toDto(final User user) {
        return new UserResponseDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail());
    }
}