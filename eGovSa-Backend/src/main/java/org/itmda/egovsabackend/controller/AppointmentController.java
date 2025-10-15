package org.itmda.egovsabackend.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.itmda.egovsabackend.dto.AppointmentDto;
import org.itmda.egovsabackend.service.AppointmentService;
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
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {
    
    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentDto> createAppointment(@RequestBody AppointmentDto appointmentDto) {
        try {
            AppointmentDto appointment = appointmentService.createAppointment(appointmentDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AppointmentDto>> getUserAppointments(@PathVariable String userId) {
        try {
            UUID userUuid = UUID.fromString(userId);
            List<AppointmentDto> appointments = appointmentService.getUserAppointments(userUuid);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}/status/{status}")
    public ResponseEntity<List<AppointmentDto>> getUserAppointmentsByStatus(
            @PathVariable String userId,
            @PathVariable String status) {
        try {
            UUID userUuid = UUID.fromString(userId);
            List<AppointmentDto> appointments = appointmentService.getUserAppointmentsByStatus(userUuid, status);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentDto> getAppointmentById(@PathVariable String id) {
        try {
            UUID appointmentUuid = UUID.fromString(id);
            AppointmentDto appointment = appointmentService.getAppointmentById(appointmentUuid);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AppointmentDto> updateAppointmentStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            UUID appointmentUuid = UUID.fromString(id);
            String status = statusUpdate.get("status");
            
            AppointmentDto updated = appointmentService.updateAppointmentStatus(appointmentUuid, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        try {
            UUID appointmentUuid = UUID.fromString(id);
            appointmentService.deleteAppointment(appointmentUuid);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
