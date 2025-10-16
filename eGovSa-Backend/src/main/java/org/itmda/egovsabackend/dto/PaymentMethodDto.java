package org.itmda.egovsabackend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethodDto {
    private UUID id;
    private UUID userId;
    private String methodType;
    private String provider;
    private String lastFour;
    private String cardholderName;
    private String expiryDate;
    private Boolean isDefault;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
