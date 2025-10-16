package org.itmda.egovsabackend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.itmda.egovsabackend.dto.CreatePaymentMethodRequest;
import org.itmda.egovsabackend.entity.PaymentMethod;
import org.itmda.egovsabackend.repository.PaymentMethodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;

    /**
     * Create a new payment method for a user
     */
    @Transactional
    public PaymentMethod createPaymentMethod(UUID userId, CreatePaymentMethodRequest request) {
        log.info("Creating payment method for user: {}", userId);
        
        PaymentMethod paymentMethod = new PaymentMethod();
        paymentMethod.setUserId(userId);
        paymentMethod.setMethodType(request.getMethodType());
        paymentMethod.setProvider(request.getProvider());
        paymentMethod.setLastFour(request.getLastFour());
        paymentMethod.setCardholderName(request.getCardholderName());
        paymentMethod.setExpiryDate(request.getExpiryDate());
        paymentMethod.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : false);
        paymentMethod.setCreatedAt(LocalDateTime.now());
        paymentMethod.setUpdatedAt(LocalDateTime.now());

        // If this is set as default, unset any existing default
        if (paymentMethod.getIsDefault()) {
            unsetExistingDefault(userId);
        }

        PaymentMethod saved = paymentMethodRepository.save(paymentMethod);
        log.info("Payment method created with ID: {}", saved.getId());
        
        return saved;
    }

    /**
     * Get all payment methods for a user
     */
    public List<PaymentMethod> getUserPaymentMethods(UUID userId) {
        log.info("Fetching payment methods for user: {}", userId);
        return paymentMethodRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
    }

    /**
     * Get a specific payment method by ID
     */
    public Optional<PaymentMethod> getPaymentMethodById(UUID id) {
        return paymentMethodRepository.findById(id);
    }

    /**
     * Update a payment method
     */
    @Transactional
    public PaymentMethod updatePaymentMethod(UUID id, CreatePaymentMethodRequest request) {
        log.info("Updating payment method: {}", id);
        
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        if (request.getMethodType() != null) {
            paymentMethod.setMethodType(request.getMethodType());
        }
        if (request.getProvider() != null) {
            paymentMethod.setProvider(request.getProvider());
        }
        if (request.getLastFour() != null) {
            paymentMethod.setLastFour(request.getLastFour());
        }
        if (request.getCardholderName() != null) {
            paymentMethod.setCardholderName(request.getCardholderName());
        }
        if (request.getExpiryDate() != null) {
            paymentMethod.setExpiryDate(request.getExpiryDate());
        }
        if (request.getIsDefault() != null) {
            // If setting as default, unset any existing default
            if (request.getIsDefault()) {
                unsetExistingDefault(paymentMethod.getUserId());
            }
            paymentMethod.setIsDefault(request.getIsDefault());
        }
        
        paymentMethod.setUpdatedAt(LocalDateTime.now());

        return paymentMethodRepository.save(paymentMethod);
    }

    /**
     * Delete a payment method
     */
    @Transactional
    public void deletePaymentMethod(UUID id) {
        log.info("Deleting payment method: {}", id);
        paymentMethodRepository.deleteById(id);
    }

    /**
     * Set a payment method as default
     */
    @Transactional
    public PaymentMethod setAsDefault(UUID id) {
        log.info("Setting payment method as default: {}", id);
        
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));

        // Unset existing default for this user
        unsetExistingDefault(paymentMethod.getUserId());

        // Set this one as default
        paymentMethod.setIsDefault(true);
        paymentMethod.setUpdatedAt(LocalDateTime.now());

        return paymentMethodRepository.save(paymentMethod);
    }

    /**
     * Helper method to unset existing default payment method
     */
    private void unsetExistingDefault(UUID userId) {
        Optional<PaymentMethod> existingDefault = paymentMethodRepository.findByUserIdAndIsDefault(userId, true);
        existingDefault.ifPresent(pm -> {
            pm.setIsDefault(false);
            pm.setUpdatedAt(LocalDateTime.now());
            paymentMethodRepository.save(pm);
        });
    }
}
