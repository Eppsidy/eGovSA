package org.itmda.egovsabackend.repository;

import java.util.List;
import java.util.UUID;

import org.itmda.egovsabackend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    
    List<Appointment> findByUserId(UUID userId);
    
    List<Appointment> findByUserIdAndStatus(UUID userId, String status);
    
    List<Appointment> findByUserIdOrderByAppointmentDateAsc(UUID userId);
    
    List<Appointment> findByApplicationId(UUID applicationId);
}
