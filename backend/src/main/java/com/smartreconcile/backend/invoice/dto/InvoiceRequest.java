package com.smartreconcile.backend.invoice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class InvoiceRequest {
    @NotNull
    private Long vendorId;

    @NotBlank
    private String invoiceNumber;

    private String poNumber;

    @NotNull
    @Min(value = 1, message = "Amount must be greater than 0")
    private BigDecimal amountTotal;

    @NotNull
    private LocalDate issueDate;

    @NotNull
    private LocalDate dueDate;

    private String fileUrl;
}
