package com.smartreconcile.backend.payment.controller;

import com.smartreconcile.backend.payment.dto.PaymentRequest;
import com.smartreconcile.backend.payment.dto.PaymentResponse;
import com.smartreconcile.backend.payment.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasRole('ACCOUNTS') or hasRole('FINANCE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> recordPayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPayment(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ACCOUNTS') or hasRole('FINANCE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<PaymentResponse>> getAllPayments(Pageable pageable) {
        return ResponseEntity.ok(paymentService.getAllPayments(pageable));
    }

    @GetMapping("/unallocated")
    @PreAuthorize("hasRole('ACCOUNTS') or hasRole('FINANCE_MANAGER')")
    public ResponseEntity<Page<PaymentResponse>> getUnallocatedPayments(Pageable pageable) {
        return ResponseEntity.ok(paymentService.getUnallocatedPayments(pageable));
    }

    @Autowired
    com.smartreconcile.backend.auth.security.SecurityUtils securityUtils;

    @GetMapping("/my-payments/{vendorId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ACCOUNTS') or hasRole('FINANCE_MANAGER')")
    public ResponseEntity<Page<PaymentResponse>> getMyPayments(@PathVariable Long vendorId, Pageable pageable) {
        if (!securityUtils.isVendorOwner(vendorId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(paymentService.getPaymentsByVendor(vendorId, pageable));
    }
}
