package com.retiantonio.onlineforum.service;

import com.retiantonio.onlineforum.dtos.request.LoginRequest;
import com.retiantonio.onlineforum.dtos.request.RegisterRequest;
import com.retiantonio.onlineforum.dtos.response.AuthResponse;
import com.retiantonio.onlineforum.exceptions.AccountSuspendedException;
import com.retiantonio.onlineforum.exceptions.AlreadyExistsException;
import com.retiantonio.onlineforum.model.Moderator;
import com.retiantonio.onlineforum.model.RegularUser;
import com.retiantonio.onlineforum.repository.UserRepository;
import com.retiantonio.onlineforum.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Tests")
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private RegularUser regularUser;
    private Moderator moderator;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setModerator(false);

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        regularUser = new RegularUser();
        regularUser.setId(1L);
        regularUser.setUsername("testuser");
        regularUser.setEmail("test@example.com");
        regularUser.setPassword("hashedPassword");

        moderator = new Moderator();
        moderator.setId(2L);
        moderator.setUsername("moderator");
        moderator.setEmail("mod@example.com");
        moderator.setPassword("hashedPassword");
    }

    @Test
    @DisplayName("Should successfully register a new regular user")
    void testRegisterNewRegularUser_Success() {
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any())).thenReturn(regularUser);
        when(jwtUtil.generateToken("testuser", "USER")).thenReturn("jwt.token.here");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("jwt.token.here", response.getToken());
        assertEquals("USER", response.getRole());
        verify(userRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Should successfully register a new moderator")
    void testRegisterNewModerator_Success() {
        registerRequest.setModerator(true);
        registerRequest.setUsername("moderator");
        registerRequest.setEmail("mod@example.com");

        when(userRepository.existsByUsername("moderator")).thenReturn(false);
        when(userRepository.existsByEmail("mod@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any())).thenReturn(moderator);
        when(jwtUtil.generateToken("moderator", "MODERATOR")).thenReturn("jwt.token.here");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("moderator", response.getUsername());
        assertEquals("MODERATOR", response.getRole());
    }

    @Test
    @DisplayName("Should throw AlreadyExistsException when username already exists")
    void testRegisterDuplicateUsername_ThrowsException() {
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        assertThrows(AlreadyExistsException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw AlreadyExistsException when email already exists")
    void testRegisterDuplicateEmail_ThrowsException() {
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(AlreadyExistsException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully login with correct credentials")
    void testLoginWithCorrectCredentials_Success() {
        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(regularUser));
        when(jwtUtil.generateToken("testuser", "USER")).thenReturn("jwt.token.here");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("jwt.token.here", response.getToken());
    }

    @Test
    @DisplayName("Should throw exception when user not found during login")
    void testLoginUserNotFound_ThrowsException() {
        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> authService.login(loginRequest));
    }

    @Test
    @DisplayName("Should throw AccountSuspendedException for suspended user")
    void testLoginSuspendedUser_ThrowsException() {
        regularUser.setSuspendedUntil(LocalDateTime.now().plusDays(1));
        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(regularUser));

        assertThrows(AccountSuspendedException.class, () -> authService.login(loginRequest));
    }
}