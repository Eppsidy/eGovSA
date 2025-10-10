package org.itmda.egovsabackend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.itmda.egovsabackend.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, UUID> {
    
    Optional<Service> findByServiceName(String serviceName);
    
    List<Service> findByIsActive(Boolean isActive);
    
    List<Service> findByCategory(String category);
    
    List<Service> findByCategoryAndIsActive(String category, Boolean isActive);
}
