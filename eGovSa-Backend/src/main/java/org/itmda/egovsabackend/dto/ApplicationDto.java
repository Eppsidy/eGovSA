package org.itmda.egovsabackend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDto {
    private UUID id;
    private UUID userId;
    private String serviceType;
    private String referenceNumber;
    private String status;
    private String currentStep;
    private String applicationData;
    private LocalDateTime submittedAt;
    private LocalDateTime expectedCompletionDate;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ApplicationDocumentDto> documents;
}
