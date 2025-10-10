package org.itmda.egovsabackend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.itmda.egovsabackend.dto.ServiceDto;
import org.itmda.egovsabackend.entity.Service;
import org.itmda.egovsabackend.repository.ServiceRepository;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {
    
    private final ServiceRepository serviceRepository;
    
    /**
     * Get all active services
     */
    public List<ServiceDto> getAllActiveServices() {
        List<Service> services = serviceRepository.findByIsActive(true);
        return services.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get services by category
     */
    public List<ServiceDto> getServicesByCategory(String category) {
        List<Service> services = serviceRepository.findByCategoryAndIsActive(category, true);
        return services.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get service by name
     */
    public ServiceDto getServiceByName(String serviceName) {
        Service service = serviceRepository.findByServiceName(serviceName)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        return convertToDto(service);
    }
    
    /**
     * Create new service
     */
    @Transactional
    public ServiceDto createService(ServiceDto serviceDto) {
        Service service = new Service();
        service.setServiceName(serviceDto.getServiceName());
        service.setDescription(serviceDto.getDescription());
        service.setCategory(serviceDto.getCategory());
        service.setRequiredDocuments(serviceDto.getRequiredDocuments());
        service.setProcessingTimeDays(serviceDto.getProcessingTimeDays());
        service.setFees(serviceDto.getFees());
        service.setIsActive(serviceDto.getIsActive() != null ? serviceDto.getIsActive() : true);
        
        Service saved = serviceRepository.save(service);
        return convertToDto(saved);
    }
    
    private ServiceDto convertToDto(Service service) {
        ServiceDto dto = new ServiceDto();
        dto.setId(service.getId());
        dto.setServiceName(service.getServiceName());
        dto.setDescription(service.getDescription());
        dto.setCategory(service.getCategory());
        dto.setRequiredDocuments(service.getRequiredDocuments());
        dto.setProcessingTimeDays(service.getProcessingTimeDays());
        dto.setFees(service.getFees());
        dto.setIsActive(service.getIsActive());
        dto.setCreatedAt(service.getCreatedAt());
        dto.setUpdatedAt(service.getUpdatedAt());
        return dto;
    }
}
