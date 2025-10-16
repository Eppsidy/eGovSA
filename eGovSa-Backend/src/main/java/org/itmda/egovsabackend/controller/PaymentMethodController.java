package org.itmda.egovsabackend.controller;

import java.util.List;
import java.util.UUID;

import org.itmda.egovsabackend.dto.CreatePaymentMethodRequest;
import org.itmda.egovsabackend.entity.PaymentMethod;
import org.itmda.egovsabackend.service.PaymentMethodService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    /**
     * Create a new payment method
     * POST /api/payment-methods/user/{userId}
     */
    @PostMapping("/user/{userId}")
    public ResponseEntity<PaymentMethod> createPaymentMethod(
            @PathVariable String userId,
            @RequestBody CreatePaymentMethodRequest request) {
        try {
            UUID userUuid = UUID.fromString(userId);
            PaymentMethod created = paymentMethodService.createPaymentMethod(userUuid, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            log.error("Invalid userId format: {}", userId);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error creating payment method: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get all payment methods for a user
     * GET /api/payment-methods/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentMethod>> getUserPaymentMethods(@PathVariable String userId) {
        try {
            UUID userUuid = UUID.fromString(userId);
            List<PaymentMethod> paymentMethods = paymentMethodService.getUserPaymentMethods(userUuid);
            return ResponseEntity.ok(paymentMethods);
        } catch (IllegalArgumentException e) {
            log.error("Invalid userId format: {}", userId);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get a specific payment method by ID
     * GET /api/payment-methods/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethod> getPaymentMethod(@PathVariable String id) {
        try {
            UUID paymentMethodId = UUID.fromString(id);
            return paymentMethodService.getPaymentMethodById(paymentMethodId)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            log.error("Invalid payment method ID format: {}", id);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update a payment method
     * PUT /api/payment-methods/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<PaymentMethod> updatePaymentMethod(
            @PathVariable String id,
            @RequestBody CreatePaymentMethodRequest request) {
        try {
            UUID paymentMethodId = UUID.fromString(id);
            PaymentMethod updated = paymentMethodService.updatePaymentMethod(paymentMethodId, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            log.error("Invalid payment method ID format: {}", id);
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            log.error("Error updating payment method: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete a payment method
     * DELETE /api/payment-methods/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable String id) {
        try {
            UUID paymentMethodId = UUID.fromString(id);
            paymentMethodService.deletePaymentMethod(paymentMethodId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.error("Invalid payment method ID format: {}", id);
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Set a payment method as default
     * PATCH /api/payment-methods/{id}/set-default
     */
    @PatchMapping("/{id}/set-default")
    public ResponseEntity<PaymentMethod> setAsDefault(@PathVariable String id) {
        try {
            UUID paymentMethodId = UUID.fromString(id);
            PaymentMethod updated = paymentMethodService.setAsDefault(paymentMethodId);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            log.error("Invalid payment method ID format: {}", id);
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            log.error("Error setting default payment method: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
