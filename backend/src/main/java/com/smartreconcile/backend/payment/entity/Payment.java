package com.smartreconcile.backend.payment.entity;

import com.smartreconcile.backend.model.BaseEntity;
import com.smartreconcile.backend.vendor.entity.Vendor;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments", uniqueConstraints = { @UniqueConstraint(columnNames = "transactionReference") }, indexes = {
        @Index(name = "idx_payment_date", columnList = "paymentDate"),
        @Index(name = "idx_payment_status", columnList = "status")
})
@Getter
@Setter
public class Payment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", updatable = false)
    private Vendor vendor;

    @NotBlank
    @Column(updatable = false)
    private String transactionReference;

    @NotNull
    @Column(precision = 19, scale = 2, updatable = false)
    private BigDecimal amount;

    @NotNull
    @Column(precision = 19, scale = 2)
    private BigDecimal amountAllocated = BigDecimal.ZERO;

    @NotNull
    @Column(updatable = false)
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, updatable = false)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PaymentStatus status = PaymentStatus.UNALLOCATED;

    private String payerName;

    private String description;

    @PrePersist
    @PreUpdate
    public void updateStatus() {
        // Renamed to avoid confusion, but PreUpdate calls this.
        withStatus();
    }

    public void withStatus() {
        if (amountAllocated == null)
            amountAllocated = BigDecimal.ZERO;

        if (amountAllocated.compareTo(BigDecimal.ZERO) == 0) {
            this.status = PaymentStatus.UNALLOCATED;
        } else if (amountAllocated.compareTo(amount) < 0) {
            this.status = PaymentStatus.PARTIALLY_ALLOCATED;
        } else {
            this.status = PaymentStatus.FULLY_ALLOCATED;
        }
    }
}
