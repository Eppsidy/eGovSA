package org.itmda.egovsabackend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.itmda.egovsabackend.entity.AdminAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminActionRepository extends JpaRepository<AdminAction, UUID> {
    
    List<AdminAction> findByApplicationIdOrderByTimestampDesc(UUID applicationId);
    
    List<AdminAction> findByUserIdOrderByTimestampDesc(UUID userId);
    
    List<AdminAction> findByActionTypeOrderByTimestampDesc(String actionType);
    
    List<AdminAction> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);
}
