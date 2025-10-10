package org.itmda.egovsabackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WelcomeResponse {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String fullName;
        private String avatarUrl;
        private String dateOfBirth;
        private Boolean isVerified;
        private String residentialAddress;
        private String postalAddress;
        private String idNumber;
        private String profilePhotoUrl;
        private String gender;
    }
    private String message;

    private UserInfo user;
}
