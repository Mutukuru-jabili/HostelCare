package com.hostelcare.config;

import com.hostelcare.entity.Complaint;
import com.hostelcare.entity.User;
import com.hostelcare.repository.ComplaintRepository;
import com.hostelcare.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, ComplaintRepository complaintRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@hostelcare.com")) {
            User admin = new User();
            admin.setFullName("HostelCare Admin");
            admin.setEmail("admin@hostelcare.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhone("9999999999");
            admin.setHostelName("HostelCare HQ");
            admin.setRoomNumber("ADMIN");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }

        if (complaintRepository.count() == 0) {
            User student = userRepository.findByEmail("student1@hostelcare.com").orElseGet(() -> {
                User s = new User();
                s.setFullName("Aishwarya Sharma");
                s.setEmail("student1@hostelcare.com");
                s.setPassword(passwordEncoder.encode("student123"));
                s.setPhone("9876543210");
                s.setHostelName("Green Valley PG");
                s.setRoomNumber("A-204");
                s.setRole(User.Role.STUDENT);
                return userRepository.save(s);
            });

            Complaint c1 = new Complaint();
            c1.setTitle("Fan not working");
            c1.setDescription("The ceiling fan in my room is not working since yesterday.");
            c1.setCategory(Complaint.Category.ELECTRICAL);
            c1.setRoomNumber("A-204");
            c1.setPriority(Complaint.Priority.HIGH);
            c1.setStatus(Complaint.Status.PENDING);
            c1.setStudent(student);
            complaintRepository.save(c1);

            Complaint c2 = new Complaint();
            c2.setTitle("Water leakage");
            c2.setDescription("There is a leak near the bathroom pipe causing water to pool on the floor.");
            c2.setCategory(Complaint.Category.WATER);
            c2.setRoomNumber("A-204");
            c2.setPriority(Complaint.Priority.URGENT);
            c2.setStatus(Complaint.Status.ASSIGNED);
            c2.setAssignedStaff("Plumbing Staff");
            c2.setStudent(student);
            complaintRepository.save(c2);

            Complaint c3 = new Complaint();
            c3.setTitle("Wi-Fi not working");
            c3.setDescription("The internet connection is unstable and keeps disconnecting.");
            c3.setCategory(Complaint.Category.WIFI);
            c3.setRoomNumber("B-112");
            c3.setPriority(Complaint.Priority.MEDIUM);
            c3.setStatus(Complaint.Status.IN_PROGRESS);
            c3.setAssignedStaff("General Maintenance Staff");
            c3.setStudent(student);
            complaintRepository.save(c3);

            Complaint c4 = new Complaint();
            c4.setTitle("Bathroom cleaning required");
            c4.setDescription("The washroom is dirty and needs cleaning immediately.");
            c4.setCategory(Complaint.Category.CLEANING);
            c4.setRoomNumber("B-112");
            c4.setPriority(Complaint.Priority.MEDIUM);
            c4.setStatus(Complaint.Status.RESOLVED);
            c4.setAssignedStaff("Cleaning Staff");
            c4.setStudent(student);
            complaintRepository.save(c4);

            Complaint c5 = new Complaint();
            c5.setTitle("Broken chair");
            c5.setDescription("The study chair in the room is broken and unsafe to use.");
            c5.setCategory(Complaint.Category.FURNITURE);
            c5.setRoomNumber("C-309");
            c5.setPriority(Complaint.Priority.LOW);
            c5.setStatus(Complaint.Status.PENDING);
            c5.setStudent(student);
            complaintRepository.save(c5);

            Complaint c6 = new Complaint();
            c6.setTitle("Tube light not working");
            c6.setDescription("The tube light in the room is flickering and has stopped working.");
            c6.setCategory(Complaint.Category.ELECTRICAL);
            c6.setRoomNumber("C-309");
            c6.setPriority(Complaint.Priority.HIGH);
            c6.setStatus(Complaint.Status.ASSIGNED);
            c6.setAssignedStaff("Electrical Staff");
            c6.setStudent(student);
            complaintRepository.save(c6);
        }
    }
}
