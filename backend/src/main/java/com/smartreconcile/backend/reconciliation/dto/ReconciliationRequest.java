package com.smartreconcile.backend.reconciliation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReconciliationRequest {
    private Long targetVendorId; // Optional: Run only for specific vendor
    private String strategy; // FIFO, EXACT_MATCH
}
