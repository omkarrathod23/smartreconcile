package com.smartreconcile.backend.payment.service;

import com.smartreconcile.backend.payment.dto.PaymentRequest;
import com.smartreconcile.backend.payment.dto.PaymentResponse;
import com.smartreconcile.backend.payment.entity.Payment;
import com.smartreconcile.backend.payment.entity.PaymentStatus;
import com.smartreconcile.backend.payment.repository.PaymentRepository;
import com.smartreconcile.backend.vendor.entity.Vendor;
import com.smartreconcile.backend.vendor.repository.VendorRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class PaymentService {

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    VendorRepository vendorRepository;

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        if (paymentRepository.findByTransactionReference(request.getTransactionReference()).isPresent()) {
            throw new RuntimeException("Transaction reference already exists.");
        }

        Payment payment = new Payment();
        BeanUtils.copyProperties(request, payment);

        if (request.getVendorId() != null) {
            Vendor vendor = vendorRepository.findById(request.getVendorId())
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));
            payment.setVendor(vendor);
        }

        payment.setAmountAllocated(BigDecimal.ZERO);
        payment.setStatus(PaymentStatus.UNALLOCATED);

        Payment saved = paymentRepository.save(payment);
        return mapToResponse(saved);
    }

    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(this::mapToResponse);
    }

    public Page<PaymentResponse> getPaymentsByVendor(Long vendorId, Pageable pageable) {
        return paymentRepository.findByVendorId(vendorId, pageable).map(this::mapToResponse);
    }

    public Page<PaymentResponse> getUnallocatedPayments(Pageable pageable) {
        return paymentRepository.findByStatus(PaymentStatus.UNALLOCATED, pageable).map(this::mapToResponse);
    }

    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return mapToResponse(payment);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        BeanUtils.copyProperties(payment, response);
        if (payment.getVendor() != null) {
            response.setVendorName(payment.getVendor().getName());
        } else {
            response.setVendorName("UNKNOWN");
        }
        return response;
    }
}
