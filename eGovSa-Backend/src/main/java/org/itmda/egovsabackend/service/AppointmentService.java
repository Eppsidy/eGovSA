package org.itmda.egovsabackend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.itmda.egovsabackend.dto.AppointmentDto;
import org.itmda.egovsabackend.dto.NotificationDto;
import org.itmda.egovsabackend.entity.Appointment;
import org.itmda.egovsabackend.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    
    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;
    
    /**
     * Create a new appointment
     */
    @Transactional
    public AppointmentDto createAppointment(AppointmentDto appointmentDto) {
        Appointment appointment = new Appointment();
        appointment.setUserId(appointmentDto.getUserId());
        appointment.setApplicationId(appointmentDto.getApplicationId());
        appointment.setAppointmentDate(appointmentDto.getAppointmentDate());
        appointment.setAppointmentTime(appointmentDto.getAppointmentTime());
        appointment.setServiceType(appointmentDto.getServiceType());
        appointment.setLocation(appointmentDto.getLocation());
        appointment.setLocationAddress(appointmentDto.getLocationAddress());
        appointment.setStatus(appointmentDto.getStatus() != null ? appointmentDto.getStatus() : "Scheduled");
        appointment.setNotes(appointmentDto.getNotes());
        
        Appointment saved = appointmentRepository.save(appointment);
        
        // Create notification for the new appointment
        try {
            NotificationDto notification = new NotificationDto();
            notification.setUserId(saved.getUserId());
            notification.setTitle("Appointment Scheduled");
            notification.setDescription(String.format("Your appointment for %s has been scheduled at %s on %s",
                    saved.getServiceType(),
                    saved.getLocation(),
                    saved.getAppointmentDate().toString()));
            notification.setNotificationType("APPOINTMENT_CREATED");
            notification.setRelatedId(saved.getId());
            notificationService.createNotification(notification);
        } catch (Exception e) {
            // Log error but don't fail appointment creation
            System.err.println("Failed to create notification for appointment: " + e.getMessage());
        }
        
        return convertToDto(saved);
    }
    
    /**
     * Get all appointments for a user
     */
    public List<AppointmentDto> getUserAppointments(UUID userId) {
        List<Appointment> appointments = appointmentRepository.findByUserIdOrderByAppointmentDateAsc(userId);
        return appointments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get appointments by status
     */
    public List<AppointmentDto> getUserAppointmentsByStatus(UUID userId, String status) {
        List<Appointment> appointments = appointmentRepository.findByUserIdAndStatus(userId, status);
        return appointments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get appointment by ID
     */
    public AppointmentDto getAppointmentById(UUID id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return convertToDto(appointment);
    }
    
    /**
     * Update appointment status
     */
    @Transactional
    public AppointmentDto updateAppointmentStatus(UUID id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(status);
        Appointment updated = appointmentRepository.save(appointment);
        return convertToDto(updated);
    }
    
    /**
     * Delete appointment
     */
    @Transactional
    public void deleteAppointment(UUID id) {
        appointmentRepository.deleteById(id);
    }
    
    private AppointmentDto convertToDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setUserId(appointment.getUserId());
        dto.setApplicationId(appointment.getApplicationId());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setServiceType(appointment.getServiceType());
        dto.setLocation(appointment.getLocation());
        dto.setLocationAddress(appointment.getLocationAddress());
        dto.setStatus(appointment.getStatus());
        dto.setNotes(appointment.getNotes());
        dto.setCreatedAt(appointment.getCreatedAt());
        dto.setUpdatedAt(appointment.getUpdatedAt());
        return dto;
    }
}
