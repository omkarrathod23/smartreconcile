package com.smartreconcile.backend.invoice.entity;

public enum InvoiceStatus {
    CREATED,
    PENDING,
    PARTIALLY_PAID,
    PAID,
    MISMATCH,
    DISPUTED,
    RESOLVED,
    OVERPAID,
    OVERDUE,
    VOID
}
