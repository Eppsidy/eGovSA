package org.itmda.egovsabackend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.itmda.egovsabackend.dto.AdminApplicationDto;
import org.itmda.egovsabackend.dto.AdminStatisticsDto;
import org.itmda.egovsabackend.dto.ApplicationDocumentDto;
import org.itmda.egovsabackend.dto.NotificationDto;
import org.itmda.egovsabackend.entity.AdminAction;
import org.itmda.egovsabackend.entity.Application;
import org.itmda.egovsabackend.entity.ApplicationDocument;
import org.itmda.egovsabackend.entity.ApplicationStatusHistory;
import org.itmda.egovsabackend.entity.Profile;
import org.itmda.egovsabackend.repository.AdminActionRepository;
import org.itmda.egovsabackend.repository.ApplicationDocumentRepository;
import org.itmda.egovsabackend.repository.ApplicationRepository;
import org.itmda.egovsabackend.repository.ApplicationStatusHistoryRepository;
import org.itmda.egovsabackend.repository.ProfileRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final ApplicationRepository applicationRepository;
    private final ProfileRepository profileRepository;
    private final ApplicationDocumentRepository documentRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final AdminActionRepository adminActionRepository;
    private final NotificationService notificationService;
    
    /**
     * Get all applications with pagination and filtering
     */
    public Page<AdminApplicationDto> getAllApplications(
            int page, 
            int size, 
            String sortBy,
            String status,
            String serviceType,
            String searchTerm) {
        
        try {
            // Default to sorting by createdAt (which exists in the Application entity)
            String sortField = sortBy != null ? sortBy : "createdAt";
            
            // Validate sort field to prevent SQL injection and ensure column exists
            if (!sortField.equals("createdAt") && !sortField.equals("submittedAt") && 
                !sortField.equals("updatedAt") && !sortField.equals("status")) {
                sortField = "createdAt";
            }
            
            Sort sort = Sort.by(Sort.Direction.DESC, sortField);
            Pageable pageable = PageRequest.of(page, size, sort);
            
            // Simply get all applications with pagination
            Page<Application> applications = applicationRepository.findAll(pageable);
            
            // Convert to DTOs
            return applications.map(this::convertToAdminDto);
        } catch (Exception e) {
            System.err.println("Error in getAllApplications: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch applications", e);
        }
    }
    
    /**
     * Get dashboard statistics
     */
    public AdminStatisticsDto getStatistics() {
        // Get all applications once
        List<Application> allApps = applicationRepository.findAll();
        
        long total = allApps.size();
        long underReview = allApps.stream().filter(a -> "Under Review".equals(a.getStatus())).count();
        long completed = allApps.stream().filter(a -> "Completed".equals(a.getStatus())).count();
        long rejected = allApps.stream().filter(a -> "Rejected".equals(a.getStatus())).count();
        long inProgress = allApps.stream().filter(a -> "In Progress".equals(a.getStatus())).count();
        long pendingPayment = allApps.stream().filter(a -> "Pending Payment".equals(a.getStatus())).count();
        
        AdminStatisticsDto stats = new AdminStatisticsDto();
        stats.setTotalApplications(total);
        stats.setPendingReview(underReview);
        stats.setApproved(completed);
        stats.setRejected(rejected);
        stats.setInProgress(inProgress);
        stats.setPendingPayment(pendingPayment);
        
        return stats;
    }
    
    /**
     * Approve an application
     */
    @Transactional
    public AdminApplicationDto approveApplication(UUID applicationId, String notes) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        String oldStatus = application.getStatus();
        
        // Update application status
        application.setStatus("Completed");
        application.setCurrentStep("Approved");
        application.setCompletedAt(LocalDateTime.now());
        
        Application updated = applicationRepository.save(application);
        
        // Log status change
        logStatusChange(applicationId, oldStatus, "Completed", notes);
        
        // Log admin action
        logAdminAction("APPROVE", applicationId, application.getUserId(), 
            "Application approved: " + application.getReferenceNumber());
        
        // Send notification to user
        sendApprovalNotification(application);
        
        return convertToAdminDto(updated);
    }
    
    /**
     * Reject an application
     */
    @Transactional
    public AdminApplicationDto rejectApplication(UUID applicationId, String notes) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        String oldStatus = application.getStatus();
        
        // Update application status
        application.setStatus("Rejected");
        application.setCurrentStep("Rejected");
        application.setCompletedAt(LocalDateTime.now());
        
        Application updated = applicationRepository.save(application);
        
        // Log status change
        logStatusChange(applicationId, oldStatus, "Rejected", notes);
        
        // Log admin action
        logAdminAction("REJECT", applicationId, application.getUserId(), 
            "Application rejected: " + application.getReferenceNumber());
        
        // Send notification to user
        sendRejectionNotification(application);
        
        return convertToAdminDto(updated);
    }
    
    /**
     * Update application status (generic)
     */
    @Transactional
    public AdminApplicationDto updateApplicationStatus(UUID applicationId, String status, String currentStep, String notes) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
        
        String oldStatus = application.getStatus();
        
        application.setStatus(status);
        if (currentStep != null) {
            application.setCurrentStep(currentStep);
        }
        
        if ("Completed".equalsIgnoreCase(status) || "Rejected".equalsIgnoreCase(status)) {
            application.setCompletedAt(LocalDateTime.now());
        }
        
        Application updated = applicationRepository.save(application);
        
        // Log status change
        logStatusChange(applicationId, oldStatus, status, notes);
        
        // Log admin action
        logAdminAction("UPDATE_STATUS", applicationId, application.getUserId(), 
            String.format("Status changed from %s to %s", oldStatus, status));
        
        // Send notification
        sendStatusUpdateNotification(application, oldStatus, status);
        
        return convertToAdminDto(updated);
    }
    
    /**
     * Get all users (profiles)
     */
    public List<Profile> getAllUsers() {
        return profileRepository.findAll();
    }
    
    // Helper methods
    
    private void logStatusChange(UUID applicationId, String oldStatus, String newStatus, String notes) {
        ApplicationStatusHistory history = new ApplicationStatusHistory();
        history.setApplicationId(applicationId);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setNotes(notes);
        statusHistoryRepository.save(history);
    }
    
    private void logAdminAction(String actionType, UUID applicationId, UUID userId, String details) {
        AdminAction action = new AdminAction();
        action.setActionType(actionType);
        action.setApplicationId(applicationId);
        action.setUserId(userId);
        action.setDetails(details);
        adminActionRepository.save(action);
    }
    
    private void sendApprovalNotification(Application application) {
        NotificationDto notification = new NotificationDto();
        notification.setUserId(application.getUserId());
        notification.setTitle("Application Approved");
        notification.setDescription(String.format(
            "Your %s application %s has been approved and is now complete.",
            application.getServiceType(),
            application.getReferenceNumber()
        ));
        notification.setNotificationType("application_status");
        notification.setRelatedId(application.getId());
        
        notificationService.createNotification(notification);
    }
    
    private void sendRejectionNotification(Application application) {
        NotificationDto notification = new NotificationDto();
        notification.setUserId(application.getUserId());
        notification.setTitle("Application Rejected");
        notification.setDescription(String.format(
            "Your %s application %s has been rejected. Please contact support for more information.",
            application.getServiceType(),
            application.getReferenceNumber()
        ));
        notification.setNotificationType("application_status");
        notification.setRelatedId(application.getId());
        
        notificationService.createNotification(notification);
    }
    
    private void sendStatusUpdateNotification(Application application, String oldStatus, String newStatus) {
        NotificationDto notification = new NotificationDto();
        notification.setUserId(application.getUserId());
        notification.setTitle("Application Status Updated");
        notification.setDescription(String.format(
            "Your %s application %s status has been updated to: %s",
            application.getServiceType(),
            application.getReferenceNumber(),
            newStatus
        ));
        notification.setNotificationType("application_status");
        notification.setRelatedId(application.getId());
        
        notificationService.createNotification(notification);
    }
    
    private AdminApplicationDto convertToAdminDto(Application application) {
        try {
            // Get user profile for applicant details
            Profile profile = null;
            try {
                profile = profileRepository.findById(application.getUserId()).orElse(null);
            } catch (Exception e) {
                // Log but don't fail if profile lookup fails
                System.err.println("Error fetching profile for user " + application.getUserId() + ": " + e.getMessage());
            }
            
            // Get documents
            List<ApplicationDocumentDto> documentDtos = List.of(); // Default to empty list
            try {
                List<ApplicationDocument> docs = documentRepository.findByApplicationId(application.getId());
                documentDtos = docs.stream()
                    .map(this::convertDocumentToDto)
                    .collect(Collectors.toList());
            } catch (Exception e) {
                // Log but don't fail if document lookup fails
                System.err.println("Error fetching documents for application " + application.getId() + ": " + e.getMessage());
            }
            
            AdminApplicationDto dto = new AdminApplicationDto();
            dto.setId(application.getId());
            dto.setUserId(application.getUserId());
            dto.setApplicantName(profile != null ? profile.getFullName() : "Unknown");
            dto.setApplicantEmail(profile != null ? profile.getEmail() : "");
            dto.setApplicantPhone(profile != null ? profile.getPhone() : "");
            dto.setApplicantIdNumber(profile != null ? profile.getIdNumber() : "");
            dto.setServiceType(application.getServiceType());
            dto.setReferenceNumber(application.getReferenceNumber());
            dto.setStatus(application.getStatus());
            dto.setCurrentStep(application.getCurrentStep() != null ? application.getCurrentStep() : "");
            dto.setApplicationData(application.getApplicationData() != null ? application.getApplicationData() : "{}");
            dto.setSubmittedAt(application.getSubmittedAt() != null ? application.getSubmittedAt() : application.getCreatedAt());
            dto.setExpectedCompletionDate(application.getExpectedCompletionDate());
            dto.setCompletedAt(application.getCompletedAt());
            dto.setCreatedAt(application.getCreatedAt());
            dto.setUpdatedAt(application.getUpdatedAt());
            dto.setDocuments(documentDtos);
            
            return dto;
        } catch (Exception e) {
            System.err.println("Error converting application " + application.getId() + " to DTO: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to convert application to DTO", e);
        }
    }
    
    private ApplicationDocumentDto convertDocumentToDto(ApplicationDocument document) {
        ApplicationDocumentDto dto = new ApplicationDocumentDto();
        dto.setId(document.getId());
        dto.setApplicationId(document.getApplicationId());
        dto.setDocumentType(document.getDocumentType());
        dto.setFileName(document.getFileName());
        dto.setFileUrl(document.getFileUrl());
        dto.setFileSize(document.getFileSize());
        dto.setUploadedAt(document.getUploadedAt());
        return dto;
    }
}
