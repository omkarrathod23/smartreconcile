package com.smartreconcile.backend.payment.dto;

import com.smartreconcile.backend.payment.entity.PaymentMethod;
import com.smartreconcile.backend.payment.entity.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class PaymentResponse {
    private Long id;
    private String vendorName;
    private String transactionReference;
    private BigDecimal amount;
    private BigDecimal amountAllocated;
    private LocalDate paymentDate;
    private PaymentMethod method;
    private PaymentStatus status;
    private String payerName;
}
