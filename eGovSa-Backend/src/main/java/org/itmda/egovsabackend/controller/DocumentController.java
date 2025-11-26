package org.itmda.egovsabackend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.itmda.egovsabackend.dto.ApplicationDocumentDto;
import org.itmda.egovsabackend.repository.ApplicationDocumentRepository;
import org.itmda.egovsabackend.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DocumentController {
    
    private final ApplicationDocumentRepository documentRepository;
    private final StorageService storageService;
    
    /**
     * Get signed download URL for a document
     * 
     * @param id Document ID
     * @param expiresIn Expiration time in seconds (default 3600 = 1 hour)
     * @return Map containing signed URL and document metadata
     */
    @GetMapping("/{id}/download-url")
    public ResponseEntity<Map<String, Object>> getDocumentDownloadUrl(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "3600") int expiresIn) {
        
        return documentRepository.findById(id)
            .map(document -> {
                String signedUrl = storageService.getSignedUrl(document.getFileUrl(), expiresIn);
                
                Map<String, Object> response = new HashMap<>();
                response.put("signedUrl", signedUrl);
                response.put("fileName", document.getFileName());
                response.put("fileSize", document.getFileSize());
                response.put("documentType", document.getDocumentType());
                response.put("expiresIn", expiresIn);
                
                return ResponseEntity.ok(response);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get document details
     * 
     * @param id Document ID
     * @return Document metadata
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDocumentDto> getDocument(@PathVariable UUID id) {
        return documentRepository.findById(id)
            .map(document -> {
                ApplicationDocumentDto dto = new ApplicationDocumentDto();
                dto.setId(document.getId());
                dto.setApplicationId(document.getApplicationId());
                dto.setDocumentType(document.getDocumentType());
                dto.setFileName(document.getFileName());
                dto.setFileUrl(document.getFileUrl());
                dto.setFileSize(document.getFileSize());
                dto.setUploadedAt(document.getUploadedAt());
                return ResponseEntity.ok(dto);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
