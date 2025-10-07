package org.itmda.egovsabackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WelcomeResponse {
    private String message;
    private UserInfo user;

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
    }
}
