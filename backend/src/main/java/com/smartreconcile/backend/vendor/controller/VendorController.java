package com.smartreconcile.backend.vendor.controller;

import com.smartreconcile.backend.vendor.entity.Vendor;
import com.smartreconcile.backend.vendor.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    @Autowired
    private VendorRepository vendorRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FINANCE_MANAGER') or hasRole('ACCOUNTS')")
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FINANCE_MANAGER')")
    public ResponseEntity<Vendor> createVendor(@RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorRepository.save(vendor));
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
