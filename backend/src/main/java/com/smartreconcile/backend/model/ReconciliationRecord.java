package com.smartreconcile.backend.model;

import com.smartreconcile.backend.invoice.entity.Invoice;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "reconciliation_records")
@Getter
@Setter
public class ReconciliationRecord extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id")
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY) // Can be multiple GRNs per Invoice ideally, but simplified 1:1 or N:1 here
    @JoinColumn(name = "grn_id")
    private GRN grn;

    @Enumerated(EnumType.STRING)
    private ReconciliationStatus status;

    private BigDecimal discrepancyAmount;

    @Column(length = 1000)
    private String notes;
}
