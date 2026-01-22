package com.smartreconcile.backend.reconciliation.strategy;

import com.smartreconcile.backend.invoice.entity.Invoice;
import com.smartreconcile.backend.invoice.entity.InvoiceStatus;
import com.smartreconcile.backend.invoice.repository.InvoiceRepository;
import com.smartreconcile.backend.payment.entity.Payment;
import com.smartreconcile.backend.payment.entity.PaymentStatus;
import com.smartreconcile.backend.payment.repository.PaymentRepository;
import com.smartreconcile.backend.reconciliation.repository.InvoicePaymentRepository;
import com.smartreconcile.backend.vendor.entity.Vendor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FifoStrategyTest {

    @Mock
    InvoiceRepository invoiceRepository;

    @Mock
    PaymentRepository paymentRepository;

    @Mock
    InvoicePaymentRepository invoicePaymentRepository;

    @InjectMocks
    FifoStrategy fifoStrategy;

    @Test
    public void testFifoAllocation_FullPayment() {
        // Setup Vendor
        Vendor vendor = new Vendor();
        vendor.setId(1L);

        // Setup Payment ($1000)
        Payment payment = new Payment();
        payment.setId(100L);
        payment.setVendor(vendor);
        payment.setAmount(new BigDecimal("1000.00"));
        payment.setAmountAllocated(BigDecimal.ZERO);
        payment.setPaymentDate(LocalDate.now());
        payment.setStatus(PaymentStatus.UNALLOCATED);

        // Setup Invoice 1 ($400, Oldest)
        Invoice inv1 = new Invoice();
        inv1.setId(1L);
        inv1.setAmountTotal(new BigDecimal("400.00"));
        inv1.setAmountPaid(BigDecimal.ZERO);
        inv1.setDueDate(LocalDate.now().minusDays(10));
        inv1.setStatus(InvoiceStatus.CREATED);
        inv1.calculateDue();

        // Setup Invoice 2 ($500)
        Invoice inv2 = new Invoice();
        inv2.setId(2L);
        inv2.setAmountTotal(new BigDecimal("500.00"));
        inv2.setAmountPaid(BigDecimal.ZERO);
        inv2.setDueDate(LocalDate.now().minusDays(5));
        inv2.setStatus(InvoiceStatus.CREATED);
        inv2.calculateDue();

        // Mock Repositories
        when(paymentRepository.findByStatusIn(anyList(), any()))
                .thenReturn(new PageImpl<>(List.of(payment)).getContent());
        when(invoiceRepository.findByVendorId(any(Long.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(inv1, inv2)));

        // Execute
        fifoStrategy.reconcile(null);

        // Verify Invoice 1 is PAID (Allocated 400)
        verify(invoicePaymentRepository, times(1)).save(argThat(link -> link.getInvoice().getId().equals(1L)
                && link.getAmount().compareTo(new BigDecimal("400.00")) == 0));

        // Verify Invoice 2 is PAID (Allocated 500)
        verify(invoicePaymentRepository, times(1)).save(argThat(link -> link.getInvoice().getId().equals(2L)
                && link.getAmount().compareTo(new BigDecimal("500.00")) == 0));

        // Verify Payment Status (Allocated 900, Remainder 100)
        // Since we are mocking, the actual object state inside the strategies loop
        // should change
        assert (payment.getAmountAllocated().compareTo(new BigDecimal("900.00")) == 0);
        assert (payment.getStatus() == PaymentStatus.PARTIALLY_ALLOCATED);
    }
}
