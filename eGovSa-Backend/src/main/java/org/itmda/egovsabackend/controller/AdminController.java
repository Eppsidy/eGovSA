package org.itmda.egovsabackend.controller;

import java.util.List;
import java.util.UUID;

import org.itmda.egovsabackend.dto.AdminApplicationDto;
import org.itmda.egovsabackend.dto.AdminStatisticsDto;
import org.itmda.egovsabackend.dto.UpdateApplicationStatusRequest;
import org.itmda.egovsabackend.entity.Profile;
import org.itmda.egovsabackend.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {
    
    private final AdminService adminService;
    
    /**
     * Get all applications with pagination and filtering
     * 
     * @param page Page number (default 0)
     * @param size Page size (default 20)
     * @param sortBy Sort field (default "submittedAt")
     * @param status Filter by status (optional)
     * @param serviceType Filter by service type (optional)
     * @param searchTerm Search term for applicant name/ID/reference (optional)
     * @return Paginated list of applications
     */
    @GetMapping("/applications")
    public ResponseEntity<Page<AdminApplicationDto>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "submittedAt") String sortBy,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String serviceType,
            @RequestParam(required = false) String searchTerm) {
        
        Page<AdminApplicationDto> applications = adminService.getAllApplications(
            page, size, sortBy, status, serviceType, searchTerm);
        
        return ResponseEntity.ok(applications);
    }
    
    /**
     * Get dashboard statistics
     * 
     * @return Statistics including total, pending, approved, rejected counts
     */
    @GetMapping("/statistics")
    public ResponseEntity<AdminStatisticsDto> getStatistics() {
        AdminStatisticsDto statistics = adminService.getStatistics();
        return ResponseEntity.ok(statistics);
    }
    
    /**
     * Approve an application
     * 
     * @param id Application ID
     * @param request Optional notes about the approval
     * @return Updated application
     */
    @PatchMapping("/applications/{id}/approve")
    public ResponseEntity<AdminApplicationDto> approveApplication(
            @PathVariable UUID id,
            @RequestBody(required = false) UpdateApplicationStatusRequest request) {
        
        String notes = request != null ? request.getNotes() : null;
        AdminApplicationDto updated = adminService.approveApplication(id, notes);
        
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Reject an application
     * 
     * @param id Application ID
     * @param request Optional notes about the rejection
     * @return Updated application
     */
    @PatchMapping("/applications/{id}/reject")
    public ResponseEntity<AdminApplicationDto> rejectApplication(
            @PathVariable UUID id,
            @RequestBody(required = false) UpdateApplicationStatusRequest request) {
        
        String notes = request != null ? request.getNotes() : null;
        AdminApplicationDto updated = adminService.rejectApplication(id, notes);
        
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Update application status (generic)
     * 
     * @param id Application ID
     * @param request Status update details
     * @return Updated application
     */
    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<AdminApplicationDto> updateApplicationStatus(
            @PathVariable UUID id,
            @RequestBody UpdateApplicationStatusRequest request) {
        
        AdminApplicationDto updated = adminService.updateApplicationStatus(
            id, request.getStatus(), request.getCurrentStep(), request.getNotes());
        
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Get all users
     * 
     * @return List of all user profiles
     */
    @GetMapping("/users")
    public ResponseEntity<List<Profile>> getAllUsers() {
        List<Profile> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
