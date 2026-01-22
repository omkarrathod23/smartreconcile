package com.smartreconcile.backend.vendor.entity;

import com.smartreconcile.backend.auth.entity.User;
import com.smartreconcile.backend.model.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vendors", uniqueConstraints = { @UniqueConstraint(columnNames = "taxId") })
@Getter
@Setter
@NoArgsConstructor
public class Vendor extends BaseEntity {

    @NotBlank
    private String name;

    @NotBlank
    private String taxId; // GSTIN / VAT ID

    @Email
    @NotBlank
    private String contactEmail;

    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    // Banking for verification
    private String bankAccountNumber;
    private String bankIfsc;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private VendorStatus status = VendorStatus.ACTIVE;
}

enum VendorStatus {
    ACTIVE, INACTIVE, BLACKLISTED
}
