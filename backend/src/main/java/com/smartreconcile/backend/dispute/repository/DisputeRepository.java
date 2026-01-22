package com.smartreconcile.backend.dispute.repository;

import com.smartreconcile.backend.dispute.entity.Dispute;
import com.smartreconcile.backend.dispute.entity.DisputeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    Page<Dispute> findByStatus(DisputeStatus status, Pageable pageable);

    Page<Dispute> findByRaisedById(Long vendorId, Pageable pageable);

    Optional<Dispute> findByInvoiceIdAndStatus(Long invoiceId, DisputeStatus status);
}
