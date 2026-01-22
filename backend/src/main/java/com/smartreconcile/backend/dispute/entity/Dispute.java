package com.smartreconcile.backend.dispute.entity;

import com.smartreconcile.backend.invoice.entity.Invoice;
import com.smartreconcile.backend.model.BaseEntity;
import com.smartreconcile.backend.vendor.entity.Vendor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "disputes", indexes = {
        @Index(name = "idx_dispute_status", columnList = "status")
})
@Getter
@Setter
public class Dispute extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "raised_by_id", nullable = false)
    private Vendor raisedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisputeReason reason;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisputeStatus status = DisputeStatus.OPEN;

    @Column(columnDefinition = "TEXT")
    private String resolutionRemarks;
}
