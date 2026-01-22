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

import java.math.BigDecimal;
import java.util.List;

@Component
public class ExactMatchStrategy implements ReconciliationStrategy {

    @Autowired
    InvoiceRepository invoiceRepository;

    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    InvoicePaymentRepository invoicePaymentRepository;

    @Override
    @Transactional
    public ReconciliationResult reconcile(Long vendorId) {
        int matched = 0;
        int processed = 0;

        // Fetch unpaid invoices
        List<Invoice> invoices = invoiceRepository.findByStatus(InvoiceStatus.CREATED, Pageable.unpaged()).getContent(); // Simplifying
                                                                                                                         // for
                                                                                                                         // demo:
                                                                                                                         // should
                                                                                                                         // filter
                                                                                                                         // by
                                                                                                                         // vendor
                                                                                                                         // if
                                                                                                                         // provided
        // In real world, complex query: status IN (CREATED, PARTIALLY_PAID) AND vendor
        // = id

        // Fetch unallocated payments
        List<Payment> payments = paymentRepository.findByStatus(PaymentStatus.UNALLOCATED, Pageable.unpaged())
                .getContent();

        for (Payment payment : payments) {
            if (vendorId != null && payment.getVendor() != null && !payment.getVendor().getId().equals(vendorId)) {
                continue;
            }

            // EXACT MATCH LOGIC: Find an invoice with exact same amount
            for (Invoice invoice : invoices) {
                if (invoice.getStatus() == InvoiceStatus.PAID)
                    continue; // Skip if already paid in previous loop cycle

                // If Payment Description contains Invoice Number OR Amounts match exactly
                boolean amountMatch = invoice.getAmountDue().compareTo(payment.getAmount()) == 0;

                if (amountMatch) {
                    processed++;
                    matched++;

                    // CREATE LINK
                    InvoicePayment link = new InvoicePayment();
                    link.setInvoice(invoice);
                    link.setPayment(payment);
                    link.setAmount(payment.getAmount());
                    link.setAllocationMethod("EXACT_MATCH");
                    link.setAllocatedBy("SYSTEM");
                    invoicePaymentRepository.save(link);

                    // UPDATE INVOICE
                    invoice.setAmountPaid(invoice.getAmountPaid().add(payment.getAmount()));
                    invoice.setStatus(InvoiceStatus.PAID);
                    invoice.calculateDue();
                    invoiceRepository.save(invoice);

                    // UPDATE PAYMENT
                    payment.setAmountAllocated(payment.getAmountAllocated().add(payment.getAmount()));
                    payment.withStatus(); // Helper in entity to set status based on amounts
                    paymentRepository.save(payment);

                    break; // Move to next payment
                }
            }
        }

        return new ReconciliationResult(processed, matched, "Exact Match Strategy Execution Complete");
    }
}
