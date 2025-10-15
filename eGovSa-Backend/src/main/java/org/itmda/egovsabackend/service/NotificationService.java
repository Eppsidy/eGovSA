package org.itmda.egovsabackend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.itmda.egovsabackend.dto.NotificationDto;
import org.itmda.egovsabackend.entity.Notification;
import org.itmda.egovsabackend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Create a new notification
     */
    @Transactional
    public NotificationDto createNotification(NotificationDto notificationDto) {
        Notification notification = new Notification();
        notification.setUserId(notificationDto.getUserId());
        notification.setTitle(notificationDto.getTitle());
        notification.setDescription(notificationDto.getDescription());
        notification.setNotificationType(notificationDto.getNotificationType());
        notification.setRelatedId(notificationDto.getRelatedId());
        notification.setIsRead(false);
        notification.setIsActive(true);

        Notification saved = notificationRepository.save(notification);
        return convertToDto(saved);
    }

    /**
     * Get all notifications for a user (ordered by newest first)
     */
    public List<NotificationDto> getUserNotifications(UUID userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get active notifications for a user
     */
    public List<NotificationDto> getActiveUserNotifications(UUID userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsActiveOrderByCreatedAtDesc(userId, true);
        return notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get unread notifications for a user
     */
    public List<NotificationDto> getUnreadUserNotifications(UUID userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        return notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Mark notification as read
     */
    @Transactional
    public NotificationDto markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));
        
        notification.setIsRead(true);
        Notification updated = notificationRepository.save(notification);
        return convertToDto(updated);
    }

    /**
     * Mark all user notifications as read
     */
    @Transactional
    public void markAllAsRead(UUID userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Get unread count for a user
     */
    public Long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    /**
     * Delete a notification
     */
    @Transactional
    public void deleteNotification(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    /**
     * Convert entity to DTO
     */
    private NotificationDto convertToDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setUserId(notification.getUserId());
        dto.setTitle(notification.getTitle());
        dto.setDescription(notification.getDescription());
        dto.setNotificationType(notification.getNotificationType());
        dto.setRelatedId(notification.getRelatedId());
        dto.setIsRead(notification.getIsRead());
        dto.setIsActive(notification.getIsActive());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setUpdatedAt(notification.getUpdatedAt());
        return dto;
    }
}
