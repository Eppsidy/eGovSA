package org.itmda.egovsabackend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "service_type", nullable = false)
    private String serviceType;
    
    @Column(name = "reference_number", unique = true, nullable = false)
    private String referenceNumber;
    
    @Column(name = "status", nullable = false)
    private String status; // In Progress, Under Review, Pending Payment, Completed, Rejected
    
    @Column(name = "current_step")
    private String currentStep;
    
    @Column(name = "application_data", columnDefinition = "TEXT")
    private String applicationData; // JSON string
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "expected_completion_date")
    private LocalDateTime expectedCompletionDate;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
