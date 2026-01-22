package com.smartreconcile.backend.invoice.entity;

import com.smartreconcile.backend.model.BaseEntity;
import com.smartreconcile.backend.vendor.entity.Vendor;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "invoices", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "vendor_id", "invoiceNumber" }) }, indexes = {
                @Index(name = "idx_invoice_status", columnList = "status"),
                @Index(name = "idx_invoice_duedate", columnList = "dueDate")
        })
@Getter
@Setter
public class Invoice extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @NotBlank
    private String invoiceNumber;

    private String poNumber;

    @NotNull
    @Column(precision = 19, scale = 2)
    private BigDecimal amountTotal;

    @NotNull
    @Column(precision = 19, scale = 2)
    private BigDecimal amountPaid = BigDecimal.ZERO;

    @NotNull
    @Column(precision = 19, scale = 2)
    private BigDecimal amountDue; // Calculated: total - paid

    @NotNull
    private LocalDate issueDate;

    @NotNull
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private InvoiceStatus status = InvoiceStatus.CREATED;

    private String fileUrl; // Path to PDF

    @PrePersist
    @PreUpdate
    public void calculateDue() {
        if (this.amountTotal == null)
            this.amountTotal = BigDecimal.ZERO;
        if (this.amountPaid == null)
            this.amountPaid = BigDecimal.ZERO;
        this.amountDue = this.amountTotal.subtract(this.amountPaid);
    }
}
