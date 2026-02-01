package com.smartreconcile.backend.auth.security;

import com.smartreconcile.backend.vendor.entity.Vendor;
import com.smartreconcile.backend.vendor.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class SecurityUtils {

    @Autowired
    private VendorRepository vendorRepository;

    public UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        return (UserDetailsImpl) authentication.getPrincipal();
    }

    public boolean isVendorOwner(Long vendorId) {
        UserDetailsImpl currentUser = getCurrentUser();
        if (currentUser == null)
            return false;

        // If Admin or Finance Manager, they can access any vendor
        boolean isInternalStaff = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") ||
                        a.getAuthority().equals("ROLE_FINANCE_MANAGER") ||
                        a.getAuthority().equals("ROLE_ACCOUNTS"));

        if (isInternalStaff)
            return true;

        // Otherwise, check if the current user is linked to this vendorId
        Optional<Vendor> vendor = vendorRepository.findByUserId(currentUser.getId());
        return vendor.isPresent() && vendor.get().getId().equals(vendorId);
    }
}
