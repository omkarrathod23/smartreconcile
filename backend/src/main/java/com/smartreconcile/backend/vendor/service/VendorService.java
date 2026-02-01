package com.smartreconcile.backend.vendor.service;

import com.smartreconcile.backend.auth.entity.ERole;
import com.smartreconcile.backend.auth.entity.Role;
import com.smartreconcile.backend.auth.entity.User;
import com.smartreconcile.backend.auth.repository.RoleRepository;
import com.smartreconcile.backend.auth.repository.UserRepository;
import com.smartreconcile.backend.vendor.entity.Vendor;
import com.smartreconcile.backend.vendor.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Transactional
    public Vendor onboardVendor(Vendor vendor, String initialPassword) {
        if (userRepository.existsByEmail(vendor.getContactEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        if (vendorRepository.existsByTaxId(vendor.getTaxId())) {
            throw new RuntimeException("Error: Tax ID already registered!");
        }

        // 1. Create User
        User user = new User(vendor.getContactEmail(),
                encoder.encode(initialPassword),
                vendor.getName());

        Set<Role> roles = new HashSet<>();
        Role vendorRole = roleRepository.findByName(ERole.ROLE_VENDOR)
                .orElseThrow(() -> new RuntimeException("Error: Role VENDOR not found."));
        roles.add(vendorRole);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        // 2. Link Vendor to User
        vendor.setUser(savedUser);
        return vendorRepository.save(vendor);
    }
}
