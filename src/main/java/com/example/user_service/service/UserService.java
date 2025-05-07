package com.example.user_service.service;

import com.example.user_service.dto.UserDTO;
import com.example.user_service.entity.User;
import com.example.user_service.repository.UserRepository;
import com.example.user_service.external.NotificationClient;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final NotificationClient notificationClient;

    public UserDTO createUser(UserDTO dto) {
        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .role(dto.getRole())
                .active(true)
                .build();
        user = userRepository.save(user);
        //notificationClient.sendNotification("Utilisateur créé : " + user.getUsername());
        //notificationClient.sendLog("Création utilisateur : " + user.getUsername());
        return toDTO(user);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public UserDTO updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id).orElseThrow();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user = userRepository.save(user);
        //notificationClient.sendLog("Modification utilisateur : " + user.getUsername());
        return toDTO(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        userRepository.delete(user);
        //notificationClient.sendLog("Suppression utilisateur : " + user.getUsername());
    }

    public void toggleActivation(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setActive(!user.isActive());
        userRepository.save(user);
        String state = user.isActive() ? "activé" : "désactivé";
        //notificationClient.sendNotification("Utilisateur " + state + " : " + user.getUsername());
        //notificationClient.sendLog("Changement d'état utilisateur : " + user.getUsername());
    }

    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .build();
    }
}
