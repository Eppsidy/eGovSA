package org.itmda.egovsabackend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.itmda.egovsabackend.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, UUID> {
    List<PaymentMethod> findByUserId(UUID userId);
    List<PaymentMethod> findByUserIdOrderByIsDefaultDescCreatedAtDesc(UUID userId);
    Optional<PaymentMethod> findByUserIdAndIsDefault(UUID userId, Boolean isDefault);
}
