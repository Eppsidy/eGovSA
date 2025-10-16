package org.itmda.egovsabackend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @Column(name = "id")
    private UUID id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "pin")
    private String pin;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "is_verified")
    private Boolean isVerified;

    @Column(name = "residential_address")
    private String residentialAddress;

    @Column(name = "postal_address")
    private String postalAddress;

    @Column(name = "id_number")
    private String idNumber;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(name = "gender")
    private String gender;

    @Column(name = "push_notifications_enabled")
    private Boolean pushNotificationsEnabled;

    @Column(name = "push_token")
    private String pushToken;
}
