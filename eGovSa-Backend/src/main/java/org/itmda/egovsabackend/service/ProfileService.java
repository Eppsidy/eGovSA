package org.itmda.egovsabackend.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.itmda.egovsabackend.entity.Profile;
import org.itmda.egovsabackend.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public Optional<Profile> getProfileById(UUID id) {
        return profileRepository.findById(id);
    }

    public Profile updateProfile(UUID id, Profile updatedProfile) {
        return profileRepository.findById(id)
                .map(existingProfile -> {
                    // Update basic info
                    if (updatedProfile.getFirstName() != null) {
                        existingProfile.setFirstName(updatedProfile.getFirstName());
                    }
                    if (updatedProfile.getLastName() != null) {
                        existingProfile.setLastName(updatedProfile.getLastName());
                    }
                    if (updatedProfile.getEmail() != null) {
                        existingProfile.setEmail(updatedProfile.getEmail());
                    }
                    if (updatedProfile.getPhone() != null) {
                        existingProfile.setPhone(updatedProfile.getPhone());
                    }
                    if (updatedProfile.getFullName() != null) {
                        existingProfile.setFullName(updatedProfile.getFullName());
                    }
                    
                    // Update additional fields
                    if (updatedProfile.getDateOfBirth() != null) {
                        existingProfile.setDateOfBirth(updatedProfile.getDateOfBirth());
                    }
                    if (updatedProfile.getGender() != null) {
                        existingProfile.setGender(updatedProfile.getGender());
                    }
                    if (updatedProfile.getIdNumber() != null) {
                        existingProfile.setIdNumber(updatedProfile.getIdNumber());
                    }
                    if (updatedProfile.getResidentialAddress() != null) {
                        existingProfile.setResidentialAddress(updatedProfile.getResidentialAddress());
                    }
                    if (updatedProfile.getPostalAddress() != null) {
                        existingProfile.setPostalAddress(updatedProfile.getPostalAddress());
                    }
                    if (updatedProfile.getAvatarUrl() != null) {
                        existingProfile.setAvatarUrl(updatedProfile.getAvatarUrl());
                    }
                    if (updatedProfile.getProfilePhotoUrl() != null) {
                        existingProfile.setProfilePhotoUrl(updatedProfile.getProfilePhotoUrl());
                    }
                    
                    // Update notification settings
                    if (updatedProfile.getPushNotificationsEnabled() != null) {
                        existingProfile.setPushNotificationsEnabled(updatedProfile.getPushNotificationsEnabled());
                    }
                    if (updatedProfile.getPushToken() != null) {
                        existingProfile.setPushToken(updatedProfile.getPushToken());
                    }
                    
                    // Update timestamp
                    existingProfile.setUpdatedAt(LocalDateTime.now());
                    
                    return profileRepository.save(existingProfile);
                })
                .orElseThrow(() -> new RuntimeException("Profile not found with id: " + id));
    }
}
