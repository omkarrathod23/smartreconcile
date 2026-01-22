package com.smartreconcile.backend.scheduler;

import com.smartreconcile.backend.invoice.entity.Invoice;
import com.smartreconcile.backend.invoice.entity.InvoiceStatus;
import com.smartreconcile.backend.invoice.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class OverdueInvoiceScheduler {

    @Autowired
    InvoiceRepository invoiceRepository;

    // Run every day at midnight (00:00)
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void markOverdueInvoices() {
        LocalDate today = LocalDate.now();

        // Find invoices that are NOT paid, NOT disputed, NOT already overdue, and
        // DueDate < Today
        List<Invoice> invoices = invoiceRepository.findAll().stream()
                .filter(i -> i.getStatus() != InvoiceStatus.PAID
                        && i.getStatus() != InvoiceStatus.DISPUTED
                        && i.getStatus() != InvoiceStatus.OVERDUE
                        && i.getStatus() != InvoiceStatus.VOID
                        && i.getDueDate().isBefore(today))
                .toList();

        for (Invoice invoice : invoices) {
            invoice.setStatus(InvoiceStatus.OVERDUE);
            // In a real system, we would trigger an Email Notification here
            System.out.println("Marked Invoice " + invoice.getInvoiceNumber() + " as OVERDUE");
        }

        invoiceRepository.saveAll(invoices);
    }
}
