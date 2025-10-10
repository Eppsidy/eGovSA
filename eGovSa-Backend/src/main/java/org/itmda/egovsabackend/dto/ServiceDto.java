package org.itmda.egovsabackend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDto {
    private UUID id;
    private String serviceName;
    private String description;
    private String category;
    private String requiredDocuments; // JSON array
    private Integer processingTimeDays;
    private Double fees;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
