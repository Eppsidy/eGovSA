package org.itmda.egovsabackend.repository;

import java.util.List;
import java.util.UUID;

import org.itmda.egovsabackend.entity.ApplicationDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument, UUID> {
    
    List<ApplicationDocument> findByApplicationId(UUID applicationId);
    
    List<ApplicationDocument> findByApplicationIdAndDocumentType(UUID applicationId, String documentType);
    
    void deleteByApplicationId(UUID applicationId);
}
