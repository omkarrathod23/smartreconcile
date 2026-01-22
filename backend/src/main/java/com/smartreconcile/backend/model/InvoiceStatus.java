package com.smartreconcile.backend.model;

public enum InvoiceStatus {
    PENDING,
    APPROVED,
    REJECTED,
    PAID
}

enum ReconciliationStatus {
    PERFECT_MATCH,
    PARTIAL_MATCH,
    MISMATCH,
    PENDING
}
