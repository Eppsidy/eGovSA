package org.itmda.egovsabackend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private UUID id;
    private UUID userId;
    private UUID applicationId;
    private LocalDateTime appointmentDate;
    private String appointmentTime;
    private String serviceType;
    private String location;
    private String locationAddress;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
