package com.smartreconcile.backend.invoice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class InvoiceStats {
    private long totalCount;
    private BigDecimal totalAmount;
    private BigDecimal totalDue;
}
