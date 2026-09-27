package com.hostelcare.repository;

import com.hostelcare.entity.Complaint;
import com.hostelcare.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStudentOrderByCreatedAtDesc(User student);

    @Query("SELECT c FROM Complaint c LEFT JOIN FETCH c.student s ORDER BY c.createdAt DESC")
    List<Complaint> findAllWithStudentOrderByCreatedAtDesc();

    @Query("SELECT c FROM Complaint c LEFT JOIN FETCH c.student s WHERE c.student = :student ORDER BY c.createdAt DESC")
    List<Complaint> findByStudentWithStudentOrderByCreatedAtDesc(@Param("student") User student);

    @Query("SELECT c FROM Complaint c LEFT JOIN FETCH c.student s WHERE c.id = :id")
    Complaint findByIdWithStudent(@Param("id") Long id);
}
