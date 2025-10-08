package org.itmda.egovsabackend.controller;

import java.util.UUID;

import org.itmda.egovsabackend.dto.WelcomeResponse;
import org.itmda.egovsabackend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HomeController {

    private final ProfileService profileService;

    @GetMapping("/welcome/{userId}")
    public ResponseEntity<WelcomeResponse> welcomeUser(@PathVariable String userId) {
        try {
            UUID id = UUID.fromString(userId);
            return profileService.getProfileById(id)
                    .map(profile -> {
                        WelcomeResponse response = new WelcomeResponse();
                        String firstName = profile.getFirstName() != null ? profile.getFirstName() : "User";
                        response.setMessage("Hi " + firstName);

                        WelcomeResponse.UserInfo userInfo = new WelcomeResponse.UserInfo();
                        userInfo.setId(profile.getId().toString());
                        userInfo.setFirstName(profile.getFirstName());
                        userInfo.setLastName(profile.getLastName());
                        userInfo.setEmail(profile.getEmail());
                        userInfo.setPhone(profile.getPhone());
                        userInfo.setFullName(profile.getFullName());
                        userInfo.setAvatarUrl(profile.getAvatarUrl());
                        userInfo.setDateOfBirth(profile.getDateOfBirth());
                        userInfo.setIsVerified(profile.getIsVerified());
                        userInfo.setResidentialAddress(profile.getResidentialAddress());
                        userInfo.setPostalAddress(profile.getPostalAddress());
                        userInfo.setIdNumber(profile.getIdNumber());
                        userInfo.setProfilePhotoUrl(profile.getProfilePhotoUrl());
                        userInfo.setGender(profile.getGender());

                        response.setUser(userInfo);
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
