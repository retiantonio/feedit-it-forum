package com.retiantonio.onlineforum.service;

import com.retiantonio.onlineforum.dtos.request.LoginRequest;
import com.retiantonio.onlineforum.dtos.request.RegisterRequest;
import com.retiantonio.onlineforum.dtos.response.AuthResponse;
import com.retiantonio.onlineforum.exceptions.AccountSuspendedException;
import com.retiantonio.onlineforum.exceptions.AlreadyExistsException;
import com.retiantonio.onlineforum.exceptions.ResourceNotFoundException;
import com.retiantonio.onlineforum.model.Moderator;
import com.retiantonio.onlineforum.model.RegularUser;
import com.retiantonio.onlineforum.model.UserAbstract;
import com.retiantonio.onlineforum.repository.UserRepository;
import com.retiantonio.onlineforum.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AlreadyExistsException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AlreadyExistsException("Email already registered");
        }

        UserAbstract user = request.isModerator() ? new Moderator() : new RegularUser();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        String role = (user instanceof Moderator) ? "MODERATOR" : "USER";
        String token = jwtUtil.generateToken(user.getUsername(), role);
        return new AuthResponse(token, user.getUsername(), role, null);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword())
        );

        UserAbstract user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isSuspended()) {
            throw new AccountSuspendedException(user.getSuspendedUntil());
        }

        String role = (user instanceof Moderator) ? "MODERATOR" : "USER";
        String token = jwtUtil.generateToken(user.getUsername(), role);
        return new AuthResponse(token, user.getUsername(), role, user.getSuspendedUntil());
    }
}