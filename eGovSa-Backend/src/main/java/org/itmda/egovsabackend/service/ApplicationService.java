package org.itmda.egovsabackend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

import org.itmda.egovsabackend.dto.ApplicationDocumentDto;
import org.itmda.egovsabackend.dto.ApplicationDto;
import org.itmda.egovsabackend.dto.CreateApplicationRequest;
import org.itmda.egovsabackend.entity.Application;
import org.itmda.egovsabackend.entity.ApplicationDocument;
import org.itmda.egovsabackend.repository.ApplicationDocumentRepository;
import org.itmda.egovsabackend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    
    private static final Random RANDOM = new Random();
    private final ApplicationRepository applicationRepository;
    
    private final ApplicationDocumentRepository documentRepository;

    //Create a new application

    @Transactional
    public ApplicationDto createApplication(UUID userId, CreateApplicationRequest request) {
        Application application = new Application();
        application.setUserId(userId);
        application.setServiceType(request.getServiceType());
        application.setReferenceNumber(generateReferenceNumber(request.getServiceType()));
        application.setStatus("In Progress");
        application.setCurrentStep(getInitialStep(request.getServiceType()));
        application.setApplicationData(request.getApplicationData());
        application.setSubmittedAt(LocalDateTime.now());
        application.setExpectedCompletionDate(calculateExpectedCompletion(request.getServiceType()));
        
        Application saved = applicationRepository.save(application);
        return convertToDto(saved);
    }
    
    //Get all applications for a user

    public List<ApplicationDto> getUserApplications(UUID userId) {
        List<Application> applications = applicationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return applications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

     //Get applications by status

    public List<ApplicationDto> getUserApplicationsByStatus(UUID userId, String status) {
        List<Application> applications = applicationRepository.findByUserIdAndStatus(userId, status);
        return applications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    //Get applications by multiple statuses (for Active tab)

    public List<ApplicationDto> getUserApplicationsByStatuses(UUID userId, List<String> statuses) {
        List<Application> applications = applicationRepository.findByUserIdAndStatusIn(userId, statuses);
        return applications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

     //Get single application by ID

    public ApplicationDto getApplicationById(UUID id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return convertToDto(application);
    }
    
    //Get application by reference number

    public ApplicationDto getApplicationByReference(String referenceNumber) {
        Application application = applicationRepository.findByReferenceNumber(referenceNumber)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return convertToDto(application);
    }
    
    //Update application status

    @Transactional
    public ApplicationDto updateApplicationStatus(UUID id, String status, String currentStep) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        application.setStatus(status);
        if (currentStep != null) {
            application.setCurrentStep(currentStep);
        }
        
        if ("Completed".equalsIgnoreCase(status)) {
            application.setCompletedAt(LocalDateTime.now());
        }
        
        Application updated = applicationRepository.save(application);
        return convertToDto(updated);
    }

     //Add document to application

    @Transactional
    public ApplicationDocumentDto addDocument(UUID applicationId, ApplicationDocumentDto documentDto) {
        ApplicationDocument document = new ApplicationDocument();
        document.setApplicationId(applicationId);
        document.setDocumentType(documentDto.getDocumentType());
        document.setFileName(documentDto.getFileName());
        document.setFileUrl(documentDto.getFileUrl());
        document.setFileSize(documentDto.getFileSize());
        
        ApplicationDocument saved = documentRepository.save(document);
        return convertDocumentToDto(saved);
    }
    

    //Get documents for an application

    public List<ApplicationDocumentDto> getApplicationDocuments(UUID applicationId) {
        List<ApplicationDocument> documents = documentRepository.findByApplicationId(applicationId);
        return documents.stream()
                .map(this::convertDocumentToDto)
                .collect(Collectors.toList());
    }

     //Delete application

    @Transactional
    public void deleteApplication(UUID id) {
        documentRepository.deleteByApplicationId(id);
        applicationRepository.deleteById(id);
    }
    
    // Helper methods
    
    private String generateReferenceNumber(String serviceType) {
        String prefix = switch (serviceType.toLowerCase()) {
            case "smart id", "smart id renewal", "smart id application" -> "ID";
            case "passport", "passport application" -> "PA";
            case "learner's licence", "learners licence application" -> "LL";
            case "driving licence", "driving license renewal" -> "DL";
            case "birth certificate" -> "BC";
            case "tax return", "tax return filing" -> "TAX";
            case "business license", "business license application" -> "BUS";
            case "vehicle registration" -> "VR";
            default -> "APP";
        };
        
        int number = RANDOM.nextInt(9000) + 1000; // 1000-9999
        return prefix + String.format("%03d", number);
    }
    
    private String getInitialStep(String serviceType) {
        return switch (serviceType.toLowerCase()) {
            case "smart id", "smart id renewal", "smart id application" -> "Document Verification";
            case "passport", "passport application" -> "Application Review";
            case "learner's licence", "learners licence application" -> "Appointment Scheduled";
            case "tax return", "tax return filing" -> "Document Verification";
            default -> "Submitted";
        };
    }
    
    private LocalDateTime calculateExpectedCompletion(String serviceType) {
        int daysToAdd = switch (serviceType.toLowerCase()) {
            case "smart id", "smart id renewal", "smart id application" -> 14;
            case "passport", "passport application" -> 21;
            case "learner's licence", "learners licence application" -> 7;
            case "driving licence", "driving license renewal" -> 10;
            case "birth certificate" -> 14;
            case "tax return", "tax return filing" -> 21;
            default -> 14;
        };
        
        LocalDateTime expected = LocalDateTime.now().plusDays(daysToAdd);
        
        // Ensure it's a weekday
        while (expected.getDayOfWeek().getValue() > 5) { // 6=Sat, 7=Sun
            expected = expected.plusDays(1);
        }
        
        return expected;
    }
    
    private ApplicationDto convertToDto(Application application) {
        List<ApplicationDocumentDto> documents = getApplicationDocuments(application.getId());
        
        ApplicationDto dto = new ApplicationDto();
        dto.setId(application.getId());
        dto.setUserId(application.getUserId());
        dto.setServiceType(application.getServiceType());
        dto.setReferenceNumber(application.getReferenceNumber());
        dto.setStatus(application.getStatus());
        dto.setCurrentStep(application.getCurrentStep());
        dto.setApplicationData(application.getApplicationData());
        dto.setSubmittedAt(application.getSubmittedAt());
        dto.setExpectedCompletionDate(application.getExpectedCompletionDate());
        dto.setCompletedAt(application.getCompletedAt());
        dto.setCreatedAt(application.getCreatedAt());
        dto.setUpdatedAt(application.getUpdatedAt());
        dto.setDocuments(documents);
        
        return dto;
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
