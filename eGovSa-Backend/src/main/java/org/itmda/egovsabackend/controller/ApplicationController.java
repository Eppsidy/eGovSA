package org.itmda.egovsabackend.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.itmda.egovsabackend.dto.ApplicationDocumentDto;
import org.itmda.egovsabackend.dto.ApplicationDto;
import org.itmda.egovsabackend.dto.CreateApplicationRequest;
import org.itmda.egovsabackend.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApplicationController {
    
    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationDto> createApplication(
            @RequestParam String userId,
            @RequestBody CreateApplicationRequest request) {
        try {
            UUID userUuid = UUID.fromString(userId);
            ApplicationDto application = applicationService.createApplication(userUuid, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(application);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ApplicationDto>> getUserApplications(@PathVariable String userId) {
        try {
            UUID userUuid = UUID.fromString(userId);
            List<ApplicationDto> applications = applicationService.getUserApplications(userUuid);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<ApplicationDto>> getUserApplicationsByStatus(
            @PathVariable String userId,
            @PathVariable String status) {
        try {
            UUID userUuid = UUID.fromString(userId);
            List<ApplicationDto> applications = applicationService.getUserApplicationsByStatus(userUuid, status);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/user/{userId}/statuses")
    public ResponseEntity<List<ApplicationDto>> getUserApplicationsByStatuses(
            @PathVariable String userId,
            @RequestBody List<String> statuses) {
        try {
            UUID userUuid = UUID.fromString(userId);
            List<ApplicationDto> applications = applicationService.getUserApplicationsByStatuses(userUuid, statuses);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getApplicationById(@PathVariable String id) {
        try {
            UUID appUuid = UUID.fromString(id);
            ApplicationDto application = applicationService.getApplicationById(appUuid);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/reference/{referenceNumber}")
    public ResponseEntity<ApplicationDto> getApplicationByReference(@PathVariable String referenceNumber) {
        try {
            ApplicationDto application = applicationService.getApplicationByReference(referenceNumber);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationDto> updateApplicationStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            UUID appUuid = UUID.fromString(id);
            String status = statusUpdate.get("status");
            String currentStep = statusUpdate.get("currentStep");
            
            ApplicationDto updated = applicationService.updateApplicationStatus(appUuid, status, currentStep);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{applicationId}/documents")
    public ResponseEntity<ApplicationDocumentDto> addDocument(
            @PathVariable String applicationId,
            @RequestBody ApplicationDocumentDto documentDto) {
        try {
            UUID appUuid = UUID.fromString(applicationId);
            ApplicationDocumentDto document = applicationService.addDocument(appUuid, documentDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(document);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{applicationId}/documents")
    public ResponseEntity<List<ApplicationDocumentDto>> getApplicationDocuments(@PathVariable String applicationId) {
        try {
            UUID appUuid = UUID.fromString(applicationId);
            List<ApplicationDocumentDto> documents = applicationService.getApplicationDocuments(appUuid);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable String id) {
        try {
            UUID appUuid = UUID.fromString(id);
            applicationService.deleteApplication(appUuid);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
