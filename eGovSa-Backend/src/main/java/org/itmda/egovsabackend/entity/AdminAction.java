package org.itmda.egovsabackend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

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
@Table(name = "admin_actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminAction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "action_type", nullable = false)
    private String actionType; // APPROVE, REJECT, UPDATE_STATUS, VIEW_DETAILS, etc.
    
    @Column(name = "application_id")
    private UUID applicationId;
    
    @Column(name = "user_id")
    private UUID userId; // The user affected by the action
    
    @Column(name = "details", columnDefinition = "TEXT")
    private String details; // JSON or text describing the action
    
    @CreationTimestamp
    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;
}
