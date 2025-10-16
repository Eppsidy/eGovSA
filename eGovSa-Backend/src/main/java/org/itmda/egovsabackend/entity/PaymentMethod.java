package org.itmda.egovsabackend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

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
@Table(name = "payment_methods")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "method_type")
    private String methodType; // e.g., "card", "bank_account"

    @Column(name = "provider")
    private String provider; // e.g., "Visa", "Mastercard", "FNB", "Standard Bank"

    @Column(name = "last_four")
    private String lastFour;

    @Column(name = "cardholder_name")
    private String cardholderName;

    @Column(name = "expiry_date")
    private String expiryDate; // Format: MM/YY

    @Column(name = "is_default")
    private Boolean isDefault;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
