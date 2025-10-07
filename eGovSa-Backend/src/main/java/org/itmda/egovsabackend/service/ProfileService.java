package org.itmda.egovsabackend.service;

import lombok.RequiredArgsConstructor;
import org.itmda.egovsabackend.entity.Profile;
import org.itmda.egovsabackend.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public Optional<Profile> getProfileById(UUID id) {
        return profileRepository.findById(id);
    }
}
