package com.smartreconcile.backend.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class VendorAgingStats {
    private Long vendorId;
    private String vendorName;
    private BigDecimal totalDue;
    private long overdueInvoicesCount;
}
