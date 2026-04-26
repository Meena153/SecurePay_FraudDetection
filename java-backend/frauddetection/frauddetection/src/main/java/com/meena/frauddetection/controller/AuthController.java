package com.meena.frauddetection.controller;

import com.meena.frauddetection.model.User;
import com.meena.frauddetection.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.meena.frauddetection.service.EmailService emailService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // Ensure default Admin user always exists and has the correct password
        userRepository.findByUsername("Admin").ifPresentOrElse(
            admin -> {
                admin.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(admin);
            },
            () -> {
                User admin = new User("Admin", passwordEncoder.encode("admin123"), "fraudalerts123@gmail.com", "Admin", "ALL");
                userRepository.save(admin);
                System.out.println("✅ Created default Admin account (Admin / admin123)");
            }
        );

        // Ensure default analyst exists
        if (!userRepository.existsByUsername("analyst")) {
            User analyst = new User("analyst", passwordEncoder.encode("analyst123"), "analyst@securepay.com", "Analyst", "READ_ONLY,VIEW_ALERTS");
            userRepository.save(analyst);
        }
    }

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");
        // 🛡️ SECURITY ENFORCEMENT: Force all signups to 'Admin' for demo/admin creation
        String role = "Admin";
        String permissions = "ALL,FULL_ACCESS";

        if (username == null || email == null || password == null) {
            throw new RuntimeException("All fields are required");
        }

        if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
             throw new RuntimeException("Username or email already exists");
        }

        // 🔐 HASHING: Encrypt before saving
        User newUser = new User(username, passwordEncoder.encode(password), email, role, permissions);
        userRepository.save(newUser);

        // Map response
        Map<String, Object> response = new HashMap<>();
        Map<String, String> userResponse = new HashMap<>();
        userResponse.put("id", String.valueOf(newUser.getId()));
        userResponse.put("username", newUser.getUsername());
        userResponse.put("email", newUser.getEmail());
        userResponse.put("role", newUser.getRole());
        userResponse.put("permissions", newUser.getPermissions());
        
        response.put("user", userResponse);
        response.put("token", "mock-jwt-token-" + newUser.getId());

        // 📧 Dispatch Welcome Email (Asynchronous to prevent signup lag)
        new Thread(() -> {
            try {
                emailService.sendWelcomeEmail(
                    email, 
                    username, 
                    role, 
                    password // Send actual password as requested
                );
            } catch (Exception e) {
                System.err.println("Signup warning: Failed to send welcome email -> " + e.getMessage());
            }
        }).start();

        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            throw new RuntimeException("Username and password are required");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        
        // 🔐 SECURE MATCHING: Compare hashed password correctly, but allow plain text fallback for older accounts
        boolean passwordMatches = false;
        try {
            passwordMatches = passwordEncoder.matches(password, user.getPassword());
        } catch (Exception e) {
            // Ignore - this happens if the stored password is not a valid hash (e.g. plain text)
        }
        
        if (!passwordMatches) {
             if (!password.equals(user.getPassword())) {
                 throw new RuntimeException("Invalid username or password");
             }
        }

        // Mark user as active (logged in)
        user.setIsActive(true);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        Map<String, String> userResponse = new HashMap<>();
        userResponse.put("id", String.valueOf(user.getId()));
        userResponse.put("username", user.getUsername());
        userResponse.put("email", user.getEmail());
        userResponse.put("role", user.getRole());
        userResponse.put("permissions", user.getPermissions());
        
        response.put("user", userResponse);
        response.put("token", "mock-jwt-token-" + user.getId());

        return response;
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        Map<String, Object> response = new HashMap<>();
        if (username != null) {
            userRepository.findByUsername(username).ifPresent(u -> {
                u.setIsActive(false);
                userRepository.save(u);
            });
            response.put("message", "Logged out successfully");
        } else {
            response.put("message", "No username provided");
        }
        return response;
    }
}
