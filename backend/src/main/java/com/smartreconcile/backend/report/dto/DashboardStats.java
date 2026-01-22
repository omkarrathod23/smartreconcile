package com.smartreconcile.backend.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class DashboardStats {
    private long totalInvoices;
    private long pendingInvoices;
    private long overdueInvoices;
    private long disputedInvoices;

    private BigDecimal totalOutstandingAmount;
    private BigDecimal totalCashInBank; // Unallocated Payments
}
