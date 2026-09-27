package com.hostelcare.dto;

import com.hostelcare.entity.Complaint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private Complaint.Category category;

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotNull(message = "Priority is required")
    private Complaint.Priority priority;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Complaint.Category getCategory() {
        return category;
    }

    public void setCategory(Complaint.Category category) {
        this.category = category;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Complaint.Priority getPriority() {
        return priority;
    }

    public void setPriority(Complaint.Priority priority) {
        this.priority = priority;
    }
}
