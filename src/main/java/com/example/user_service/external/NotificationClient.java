package com.example.user_service.external;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NotificationClient {
    private final RestTemplate restTemplate = new RestTemplate();

    public void sendNotification(String message) {
        restTemplate.postForObject("http://notification-service/notify", message, Void.class);
    }

    public void sendLog(String message) {
        restTemplate.postForObject("http://log-service/log", message, Void.class);
    }
}
