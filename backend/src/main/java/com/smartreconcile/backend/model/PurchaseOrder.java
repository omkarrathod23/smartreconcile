package com.smartreconcile.backend.model;

import com.smartreconcile.backend.vendor.entity.Vendor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "purchase_orders")
@Getter
@Setter
public class PurchaseOrder extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String poNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    private BigDecimal totalAmount;

    private LocalDate issuedDate;

    // Could add LineItems relationship here
}
