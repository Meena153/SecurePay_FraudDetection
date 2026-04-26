package com.meena.frauddetection.controller;

import com.meena.frauddetection.model.User;
import com.meena.frauddetection.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Value("${app.auth.allow-signup:true}")
    private boolean allowSignup;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.meena.frauddetection.service.EmailService emailService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        // 🔥 SECURITY CHECK: Block signup if the demo mode is turned OFF.
        if (!allowSignup) {
            throw new RuntimeException("Signup is currently disabled. Access restricted to authorized personnel only.");
        }

        // 🛑 QUOTA SAFEGUARD: Prevent bot spam from filling the 5GB free tier database
        if (userRepository.count() >= 1000) {
            throw new RuntimeException("Database quota reached. Cannot create new accounts.");
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Operational ID (Username) already registered in high-security registry.");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Communication channel (Email) already assigned to another operative.");
        }

        // 🔐 HASHING: Encrypt the password correctly but keep raw password for email
        String rawPassword = user.getPassword();
        user.setPassword(passwordEncoder.encode(rawPassword));
        
        User savedUser = userRepository.save(user);
        
        // Automated notification for new analysts/admins
        try {
            emailService.sendWelcomeEmail(
                savedUser.getEmail(), 
                savedUser.getUsername(), 
                savedUser.getRole(), 
                rawPassword // Send actual password as requested
            );
        } catch (Exception e) {
            System.err.println(">>> ALERT: Personnel notification failed to send, but record was saved. Check SMTP logs.");
        }
        
        return savedUser;
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable("id") Long id, @RequestBody User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty() && !userDetails.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        user.setRole(userDetails.getRole());
        user.setPermissions(userDetails.getPermissions());
        
        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole().equalsIgnoreCase("Admin")) {
            throw new RuntimeException("Security Protocol Violation: Administrators cannot be purged from the system registry.");
        }
        
        System.out.println(">>> CLASSIFIED DELETION INITIATED FOR OPERATIVE ID: " + id);
        userRepository.delete(user);
        System.out.println(">>> AUDIT LOG: Personnel record " + user.getUsername() + " successfully purged from database.");
    }
}
