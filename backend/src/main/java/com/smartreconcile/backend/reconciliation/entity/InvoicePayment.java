package com.smartreconcile.backend.reconciliation.entity;

import com.smartreconcile.backend.invoice.entity.Invoice;
import com.smartreconcile.backend.model.BaseEntity;
import com.smartreconcile.backend.payment.entity.Payment;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoice_payments", indexes = {
        @Index(name = "idx_alloc_invoice", columnList = "invoice_id"),
        @Index(name = "idx_alloc_payment", columnList = "payment_id")
})
@Getter
@Setter
public class InvoicePayment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount; // The portion of the payment applied to this invoice

    private String allocationMethod; // EXACT_MATCH, FIFO, MANUAL

    // Audit
    private String allocatedBy; // User or SYSTEM
}
