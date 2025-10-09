package org.itmda.egovsabackend.controller;

import java.util.UUID;

import org.itmda.egovsabackend.entity.Profile;
import org.itmda.egovsabackend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{userId}")
    public ResponseEntity<Profile> getProfile(@PathVariable String userId) {
        try {
            UUID id = UUID.fromString(userId);
            return profileService.getProfileById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Profile> updateProfile(
            @PathVariable String userId,
            @RequestBody Profile profileUpdate) {
        try {
            log.info("Received profile update request for userId: {}", userId);
            log.info("Profile update data - idNumber: {}, phone: {}, gender: {}, dateOfBirth: {}", 
                    profileUpdate.getIdNumber(), 
                    profileUpdate.getPhone(),
                    profileUpdate.getGender(),
                    profileUpdate.getDateOfBirth());
            
            UUID id = UUID.fromString(userId);
            Profile updated = profileService.updateProfile(id, profileUpdate);
            
            log.info("Profile updated successfully - idNumber: {}, phone: {}", 
                    updated.getIdNumber(), 
                    updated.getPhone());
            
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            log.error("Invalid userId format: {}", userId);
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            log.error("Error updating profile: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
