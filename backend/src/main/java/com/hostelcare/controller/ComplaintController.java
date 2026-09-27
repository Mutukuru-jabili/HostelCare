package com.hostelcare.controller;

import com.hostelcare.dto.ApiResponse;
import com.hostelcare.dto.ComplaintRequest;
import com.hostelcare.entity.Complaint;
import com.hostelcare.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping("/complaints")
    public ResponseEntity<ApiResponse> createComplaint(
            @RequestParam Long studentId,
            @Valid @ModelAttribute ComplaintRequest request,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        Complaint complaint = complaintService.createComplaint(studentId, request, image);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse(true, "Complaint created successfully", complaint));
    }

    @GetMapping("/complaints/student/{studentId}")
    public ResponseEntity<ApiResponse> getStudentComplaints(@PathVariable Long studentId) {
        List<Complaint> complaints = complaintService.getStudentComplaints(studentId);
        return ResponseEntity.ok(new ApiResponse(true, "Student complaints fetched", complaints));
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<ApiResponse> getComplaintDetails(@PathVariable Long id,
                                                       @RequestParam(required = false) Long studentId) {
        Complaint complaint = studentId != null
                ? complaintService.validateStudentAccess(id, studentId)
                : complaintService.getComplaintById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Complaint details fetched", complaint));
    }

    @GetMapping("/admin/complaints")
    public ResponseEntity<ApiResponse> getAllComplaints() {
        List<Complaint> complaints = complaintService.getAllComplaints();
        return ResponseEntity.ok(new ApiResponse(true, "All complaints fetched", complaints));
    }

    @PutMapping("/admin/complaints/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable Long id,
                                                   @RequestParam Complaint.Status status) {
        Complaint complaint = complaintService.updateStatus(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Complaint status updated", complaint));
    }

    @PutMapping("/admin/complaints/{id}/priority")
    public ResponseEntity<ApiResponse> updatePriority(@PathVariable Long id,
                                                     @RequestParam Complaint.Priority priority) {
        Complaint complaint = complaintService.updatePriority(id, priority);
        return ResponseEntity.ok(new ApiResponse(true, "Complaint priority updated", complaint));
    }

    @PutMapping("/admin/complaints/{id}/assign")
    public ResponseEntity<ApiResponse> assignStaff(@PathVariable Long id,
                                                  @RequestParam String assignedStaff) {
        Complaint complaint = complaintService.assignStaff(id, assignedStaff);
        return ResponseEntity.ok(new ApiResponse(true, "Complaint assigned to staff", complaint));
    }

    @GetMapping("/admin/statistics")
    public ResponseEntity<ApiResponse> getStatistics() {
        List<Complaint> complaints = complaintService.getAllComplaints();
        long total = complaints.size();
        long pending = complaints.stream().filter(c -> c.getStatus() == Complaint.Status.PENDING).count();
        long assigned = complaints.stream().filter(c -> c.getStatus() == Complaint.Status.ASSIGNED).count();
        long inProgress = complaints.stream().filter(c -> c.getStatus() == Complaint.Status.IN_PROGRESS).count();
        long resolved = complaints.stream().filter(c -> c.getStatus() == Complaint.Status.RESOLVED).count();

        java.util.Map<String, Long> counts = new java.util.HashMap<>();
        counts.put("total", total);
        counts.put("pending", pending);
        counts.put("assigned", assigned);
        counts.put("inProgress", inProgress);
        counts.put("resolved", resolved);

        return ResponseEntity.ok(new ApiResponse(true, "Statistics fetched", counts));
    }
}
