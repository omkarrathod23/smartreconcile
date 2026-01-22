package com.smartreconcile.backend.payment.repository;

import com.smartreconcile.backend.payment.entity.Payment;
import com.smartreconcile.backend.payment.entity.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionReference(String transactionReference);

    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);

    Page<Payment> findByVendorId(Long vendorId, Pageable pageable);

    List<Payment> findByStatusIn(List<PaymentStatus> statuses, Pageable pageable);
}
