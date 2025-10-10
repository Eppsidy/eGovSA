package org.itmda.egovsabackend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.itmda.egovsabackend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    
    List<Application> findByUserId(UUID userId);
    
    List<Application> findByUserIdAndStatus(UUID userId, String status);
    
    List<Application> findByUserIdAndStatusIn(UUID userId, List<String> statuses);
    
    Optional<Application> findByReferenceNumber(String referenceNumber);
    
    List<Application> findByServiceType(String serviceType);
    
    List<Application> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
