package com.smartreconcile.backend.reconciliation.repository;

import com.smartreconcile.backend.reconciliation.entity.InvoicePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoicePaymentRepository extends JpaRepository<InvoicePayment, Long> {
    List<InvoicePayment> findByInvoiceId(Long invoiceId);

    List<InvoicePayment> findByPaymentId(Long paymentId);
}
