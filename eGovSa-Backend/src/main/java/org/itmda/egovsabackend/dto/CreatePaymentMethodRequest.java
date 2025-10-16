package org.itmda.egovsabackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentMethodRequest {
    private String methodType;
    private String provider;
    private String lastFour;
    private String cardholderName;
    private String expiryDate;
    private Boolean isDefault;
}
