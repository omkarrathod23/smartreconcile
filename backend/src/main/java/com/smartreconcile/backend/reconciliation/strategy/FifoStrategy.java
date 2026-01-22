package com.smartreconcile.backend.reconciliation.strategy;

import com.smartreconcile.backend.invoice.entity.Invoice;
import com.smartreconcile.backend.invoice.entity.InvoiceStatus;
import com.smartreconcile.backend.invoice.repository.InvoiceRepository;
import com.smartreconcile.backend.payment.entity.Payment;
import com.smartreconcile.backend.payment.entity.PaymentStatus;
import com.smartreconcile.backend.payment.repository.PaymentRepository;
import com.smartreconcile.backend.reconciliation.dto.ReconciliationResult;
import com.smartreconcile.backend.reconciliation.entity.InvoicePayment;
import com.smartreconcile.backend.reconciliation.repository.InvoicePaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import java.math.BigDecimal;
import java.util.List;

@Component
public class FifoStrategy implements ReconciliationStrategy {

    @Autowired
    InvoiceRepository invoiceRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    InvoicePaymentRepository invoicePaymentRepository;

    @Override
    @Transactional
    public ReconciliationResult reconcile(Long vendorId) {
        int processedPayments = 0;
        int matchedInvoices = 0;

        // Fetch UNALLOCATED and PARTIALLY_ALLOCATED payments
        List<PaymentStatus> eligibleStatuses = List.of(PaymentStatus.UNALLOCATED, PaymentStatus.PARTIALLY_ALLOCATED);
        List<Payment> payments = new ArrayList<>(paymentRepository.findByStatusIn(eligibleStatuses, Pageable.unpaged()));

        // Sort payments by date (Oldest First) to ensure FIFO
        payments.sort((p1, p2) -> p1.getPaymentDate().compareTo(p2.getPaymentDate()));

        for (Payment payment : payments) {
            // Vendor Filter
            if (vendorId != null && (payment.getVendor() == null || !payment.getVendor().getId().equals(vendorId))) {
                continue;
            }
            if (payment.getVendor() == null)
                continue; // Cannot FIFO without Vendor

            // Fetch Oldest Unpaid Invoices for this Vendor
            List<Invoice> invoices = invoiceRepository.findByVendorId(payment.getVendor().getId(), Pageable.unpaged())
                    .getContent();

            // Filter and Sort Invoices
            List<Invoice> eligibleInvoices = invoices.stream()
                    .filter(i -> i.getStatus() != InvoiceStatus.PAID && i.getStatus() != InvoiceStatus.DISPUTED
                            && i.getStatus() != InvoiceStatus.VOID)
                    .sorted((i1, i2) -> i1.getDueDate().compareTo(i2.getDueDate())) // Oldest due date first
                    .toList();

            boolean paymentModified = false;
            BigDecimal remainingPayment = payment.getAmount().subtract(payment.getAmountAllocated());

            for (Invoice invoice : eligibleInvoices) {
                if (remainingPayment.compareTo(BigDecimal.ZERO) <= 0)
                    break; // Payment exhausted

                BigDecimal invoiceDue = invoice.getAmountDue();

                // Determine allocation amount: Min(RemainingPayment, InvoiceDue)
                BigDecimal allocation = remainingPayment.min(invoiceDue);

                if (allocation.compareTo(BigDecimal.ZERO) > 0) {
                    // 1. Create Link (Audit Trail)
                    InvoicePayment link = new InvoicePayment();
                    link.setInvoice(invoice);
                    link.setPayment(payment);
                    link.setAmount(allocation);
                    link.setAllocationMethod("FIFO");
                    link.setAllocatedBy("SYSTEM_ALGO");
                    invoicePaymentRepository.save(link);

                    // 2. Update Invoice
                    invoice.setAmountPaid(invoice.getAmountPaid().add(allocation));
                    invoice.calculateDue();

                    // Invoice Status Transition
                    if (invoice.getAmountDue().compareTo(BigDecimal.ZERO) == 0) {
                        invoice.setStatus(InvoiceStatus.PAID);
                        matchedInvoices++;
                    } else {
                        invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
                    }
                    invoiceRepository.save(invoice);

                    // 3. Update Loop Variables
                    remainingPayment = remainingPayment.subtract(allocation);
                    payment.setAmountAllocated(payment.getAmountAllocated().add(allocation));
                    paymentModified = true;
                }
            }

            if (paymentModified) {
                payment.withStatus(); // Update Partial/Full status logic
                paymentRepository.save(payment);
                processedPayments++;
            }
        }

        return new ReconciliationResult(processedPayments, matchedInvoices,
                "FIFO Reconciliation Completed successfully.");
    }
}
