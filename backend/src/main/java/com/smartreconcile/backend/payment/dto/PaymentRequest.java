package com.smartreconcile.backend.payment.dto;

import com.smartreconcile.backend.payment.entity.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class PaymentRequest {
    private Long vendorId; // Optional

    @NotBlank
    private String transactionReference;

    @NotNull
    @Min(value = 1, message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull
    private LocalDate paymentDate;

    @NotNull
    private PaymentMethod method;

    private String payerName;
    private String description;
}
