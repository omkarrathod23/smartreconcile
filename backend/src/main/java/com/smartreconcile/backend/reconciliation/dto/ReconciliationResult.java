package com.smartreconcile.backend.reconciliation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReconciliationResult {
    private int processedPayments;
    private int matchedInvoices;
    private String message;
}
