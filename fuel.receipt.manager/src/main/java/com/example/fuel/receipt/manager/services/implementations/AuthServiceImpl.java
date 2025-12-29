package com.example.fuel.receipt.manager.services.implementations;

import com.example.fuel.receipt.manager.dtos.CreateUserDTO;
import com.example.fuel.receipt.manager.dtos.LoginRequestDTO;
import com.example.fuel.receipt.manager.dtos.UserResponseDTO;
import com.example.fuel.receipt.manager.entities.User;
import com.example.fuel.receipt.manager.mappers.AuthMapper;
import com.example.fuel.receipt.manager.repositories.UserRepository;
import com.example.fuel.receipt.manager.services.interfaces.AuthService;
import com.example.fuel.receipt.manager.services.interfaces.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(
            UserRepository userRepository,
            TokenService tokenService,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public void createUser(final CreateUserDTO createUserDto) {
        if (userRepository.findByEmail(createUserDto.email()).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }
        final User userToCreate = AuthMapper.fromDto(createUserDto);
        userToCreate.setPassword(passwordEncoder.encode(createUserDto.password()));
        final User savedUser = userRepository.save(userToCreate);
        logger.info("[USER] : User successfully created with email {}", savedUser.getEmail());
    }

    @Override
    public String login(final LoginRequestDTO loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.password()
                    )
            );
            return tokenService.generateToken(authentication);

        } catch (AuthenticationException e) {
            logger.warn("[USER] : Authentication failed for user: {}", loginRequest.email());
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Override
    public UserResponseDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(AuthMapper::toDto)
                .orElseThrow(() -> {
                    logger.error("[USER] : User not found with email {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });
    }
}