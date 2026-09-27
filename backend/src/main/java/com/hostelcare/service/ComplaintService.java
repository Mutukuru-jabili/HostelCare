package com.hostelcare.service;

import com.hostelcare.dto.ComplaintRequest;
import com.hostelcare.entity.Complaint;
import com.hostelcare.entity.User;
import com.hostelcare.exception.ResourceNotFoundException;
import com.hostelcare.exception.UnauthorizedException;
import com.hostelcare.repository.ComplaintRepository;
import com.hostelcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir:uploads/complaints}")
    private String uploadDir;

    public ComplaintService(ComplaintRepository complaintRepository, UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    public Complaint createComplaint(Long studentId, ComplaintRequest request, MultipartFile image) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle().trim());
        complaint.setDescription(request.getDescription().trim());
        complaint.setCategory(request.getCategory());
        complaint.setRoomNumber(request.getRoomNumber().trim());
        complaint.setPriority(request.getPriority());
        complaint.setStatus(Complaint.Status.PENDING);
        complaint.setStudent(student);

        if (image != null && !image.isEmpty()) {
            complaint.setImagePath(saveImage(image));
        }

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getStudentComplaints(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return complaintRepository.findByStudentWithStudentOrderByCreatedAtDesc(student);
    }

    public Complaint getComplaintById(Long complaintId) {
        Complaint complaint = complaintRepository.findByIdWithStudent(complaintId);
        if (complaint == null) {
            throw new ResourceNotFoundException("Complaint not found");
        }
        return complaint;
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllWithStudentOrderByCreatedAtDesc();
    }

    @Transactional
    public Complaint updateStatus(Long complaintId, Complaint.Status status) {
        Complaint complaint = getComplaintById(complaintId);
        complaint.setStatus(status);
        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    @Transactional
    public Complaint updatePriority(Long complaintId, Complaint.Priority priority) {
        Complaint complaint = getComplaintById(complaintId);
        complaint.setPriority(priority);
        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    @Transactional
    public Complaint assignStaff(Long complaintId, String assignedStaff) {
        Complaint complaint = getComplaintById(complaintId);
        complaint.setAssignedStaff(assignedStaff);
        complaint.setStatus(Complaint.Status.ASSIGNED);
        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    public Complaint validateStudentAccess(Long complaintId, Long studentId) {
        Complaint complaint = getComplaintById(complaintId);
        if (!Objects.equals(complaint.getStudent().getId(), studentId)) {
            throw new UnauthorizedException("You are not allowed to access this complaint");
        }
        return complaint;
    }

    public List<Complaint> getComplaintsByStudent(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return complaintRepository.findByStudentOrderByCreatedAtDesc(student);
    }

    public String saveImage(MultipartFile file) {
        try {
            String contentType = file.getContentType();
            if (contentType == null || !(contentType.startsWith("image/jpeg") || contentType.startsWith("image/png") || contentType.startsWith("image/webp"))) {
                throw new IllegalArgumentException("Only JPG, PNG, and WEBP images are allowed");
            }

            if (file.getSize() > 5 * 1024 * 1024) {
                throw new IllegalArgumentException("Image must be less than 5MB");
            }

            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Path targetPath = uploadPath.resolve(fileName).normalize();
            Files.copy(file.getInputStream(), targetPath);

            return "/uploads/complaints/" + fileName;
        } catch (IOException e) {
            throw new IllegalArgumentException("Image upload failed");
        }
    }
}
