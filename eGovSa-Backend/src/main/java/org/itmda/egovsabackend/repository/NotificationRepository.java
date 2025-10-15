package org.itmda.egovsabackend.repository;

import java.util.List;
import java.util.UUID;

import org.itmda.egovsabackend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<Notification> findByUserIdAndIsActiveOrderByCreatedAtDesc(UUID userId, Boolean isActive);
    List<Notification> findByUserIdAndIsReadOrderByCreatedAtDesc(UUID userId, Boolean isRead);
    Long countByUserIdAndIsRead(UUID userId, Boolean isRead);
}
