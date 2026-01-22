package com.smartreconcile.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "grns")
@Getter
@Setter
public class GRN extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String grnNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id")
    private PurchaseOrder purchaseOrder;

    private LocalDate receivedDate;

    private boolean isVerified;
}
