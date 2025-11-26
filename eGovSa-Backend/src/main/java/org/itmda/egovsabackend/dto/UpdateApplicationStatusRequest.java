package org.itmda.egovsabackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateApplicationStatusRequest {
    private String status;
    private String currentStep;
    private String notes;
}
