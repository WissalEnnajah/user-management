package service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import dto.LoginRequest;
import dto.RegisterRequest;

import entity.Role;
import entity.User;
import repository.UserRepository;
import security.JwtService;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private RefreshTokenService refreshTokenService;

    public String register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Set<Role> roleEnums = request.getRoles().stream()
            .map(role -> {
                try {
                    return Role.valueOf(role.toUpperCase());
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Rôle invalide : " + role);
                }
            })
            .collect(Collectors.toSet());
        user.setRoles(roleEnums);

        userRepository.save(user);

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles());

        return jwtService.generateToken(claims, user);
    }

    public Map<String, String> authenticate(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );

            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            Map<String, Object> claims = new HashMap<>();
            claims.put("roles", user.getRoles());

            String jwt = jwtService.generateToken(claims, user);
            String refreshToken = refreshTokenService.createRefreshToken(user.getEmail()).getToken();

            return Map.of("accessToken", jwt, "refreshToken", refreshToken);

        } catch (BadCredentialsException e) {
            throw new AuthenticationServiceException("Invalid credentials", e);
        }
    }

}
