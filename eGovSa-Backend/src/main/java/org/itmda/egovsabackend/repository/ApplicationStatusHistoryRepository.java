package org.itmda.egovsabackend.repository;

import java.util.List;
import java.util.UUID;

import org.itmda.egovsabackend.entity.ApplicationStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistory, UUID> {
    
    List<ApplicationStatusHistory> findByApplicationIdOrderByChangedAtDesc(UUID applicationId);
    
    List<ApplicationStatusHistory> findByApplicationId(UUID applicationId);
}
