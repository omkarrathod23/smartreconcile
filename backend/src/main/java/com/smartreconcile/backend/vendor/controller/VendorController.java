package com.smartreconcile.backend.vendor.controller;

import com.smartreconcile.backend.vendor.entity.Vendor;
import com.smartreconcile.backend.vendor.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.smartreconcile.backend.vendor.service.VendorService;
import com.smartreconcile.backend.vendor.dto.VendorOnboardingRequest;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @Autowired
    private VendorRepository vendorRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FINANCE_MANAGER') or hasRole('ACCOUNTS')")
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorRepository.findAll());
    }

    @PostMapping("/onboard")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FINANCE_MANAGER')")
    public ResponseEntity<Vendor> onboardVendor(@RequestBody VendorOnboardingRequest request) {
        Vendor vendor = new Vendor();
        vendor.setName(request.getName());
        vendor.setContactEmail(request.getContactEmail());
        vendor.setTaxId(request.getTaxId());
        vendor.setPhone(request.getPhone());
        vendor.setAddress(request.getAddress());

        return ResponseEntity.ok(vendorService.onboardVendor(vendor, request.getPassword()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FINANCE_MANAGER') or hasRole('ACCOUNTS')")
    public ResponseEntity<Vendor> getVendorById(@PathVariable Long id) {
        return vendorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me/{userId}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Vendor> getMyVendor(@PathVariable Long userId) {
        return vendorRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
