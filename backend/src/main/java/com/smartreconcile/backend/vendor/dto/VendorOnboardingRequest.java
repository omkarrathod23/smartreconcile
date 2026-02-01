package com.smartreconcile.backend.vendor.dto;

import com.smartreconcile.backend.vendor.entity.Vendor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VendorOnboardingRequest {
    private String name;
    private String contactEmail;
    private String taxId;
    private String phone;
    private String address;
    private String password;
}
