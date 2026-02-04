package com.smartreconcile.backend.invoice.dto;

import com.smartreconcile.backend.invoice.entity.InvoiceStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class InvoiceResponse {
    private Long id;
    private Long vendorId;
    private String vendorName;
    private String invoiceNumber;
    private String poNumber;
    private BigDecimal amountTotal;
    private BigDecimal amountPaid;
    private BigDecimal amountDue;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private InvoiceStatus status;
    private String fileUrl;
}
