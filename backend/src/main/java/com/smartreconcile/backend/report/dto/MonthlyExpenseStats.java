package com.smartreconcile.backend.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class MonthlyExpenseStats {
    private int year;
    private int month;
    private BigDecimal totalAmount;
    private long invoiceCount;
}
