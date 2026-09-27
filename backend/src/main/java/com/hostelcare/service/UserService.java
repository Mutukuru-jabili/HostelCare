package com.hostelcare.service;

import com.hostelcare.dto.AuthRequest;
import com.hostelcare.dto.RegisterRequest;
import com.hostelcare.entity.User;
import com.hostelcare.exception.ResourceNotFoundException;
import com.hostelcare.exception.UnauthorizedException;
import com.hostelcare.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone().trim());
        user.setHostelName(request.getHostelName().trim());
        user.setRoomNumber(request.getRoomNumber().trim());
        user.setRole(User.Role.STUDENT);

        return userRepository.save(user);
    }

    public User login(AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().trim().toLowerCase());
        if (userOpt.isEmpty()) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        return user;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public void createDefaultAdmin() {
        String adminEmail = "admin@hostelcare.com";
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setFullName("HostelCare Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhone("9999999999");
            admin.setHostelName("HostelCare HQ");
            admin.setRoomNumber("ADMIN");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }
    }
}
