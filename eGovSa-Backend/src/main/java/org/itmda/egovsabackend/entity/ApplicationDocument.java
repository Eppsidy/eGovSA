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
@Table(name = "application_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "application_id", nullable = false)
    private UUID applicationId;
    
    @Column(name = "document_type", nullable = false)
    private String documentType; // birth_certificate, parent_id, photo, etc.
    
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @Column(name = "file_url", nullable = false)
    private String fileUrl;
    
    @Column(name = "file_size")
    private Long fileSize; // in bytes
    
    @CreationTimestamp
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
}
