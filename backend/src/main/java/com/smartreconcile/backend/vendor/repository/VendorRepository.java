package com.smartreconcile.backend.vendor.repository;

import com.smartreconcile.backend.vendor.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    Optional<Vendor> findByTaxId(String taxId);

    boolean existsByTaxId(String taxId);

    Optional<Vendor> findByUserId(Long userId);
}
