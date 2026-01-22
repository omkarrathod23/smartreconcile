package com.smartreconcile.backend.report.service;

import com.smartreconcile.backend.invoice.entity.InvoiceStatus;
import com.smartreconcile.backend.invoice.repository.InvoiceRepository;
import com.smartreconcile.backend.payment.entity.Payment;
import com.smartreconcile.backend.payment.entity.PaymentStatus;
import com.smartreconcile.backend.payment.repository.PaymentRepository;
import com.smartreconcile.backend.report.dto.DashboardStats;
import com.smartreconcile.backend.report.dto.MonthlyExpenseStats;
import com.smartreconcile.backend.report.dto.VendorAgingStats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ReportService {

        @Autowired
        InvoiceRepository invoiceRepository;

        @Autowired
        PaymentRepository paymentRepository;

        @Transactional(readOnly = true)
        public DashboardStats getDashboardStats() {
                // Optimized Counts (Count(*) is faster than finding all and counting stream)
                long totalInv = invoiceRepository.count();
                // Since we don't have indexes on Status yet, we'll keep simple streams for
                // status counts or add countByStatus queries later.
                // For strict correctness with huge data,
                // invoiceRepository.countByStatus(status) is preferred.
                // For this MVP, we will stick to streams for simple filters but use specific
                // JPQL for complex reports.

                long overdue = invoiceRepository.findAll().stream()
                                .filter(i -> i.getStatus() == InvoiceStatus.OVERDUE).count();

                long disputed = invoiceRepository.findAll().stream()
                                .filter(i -> i.getStatus() == InvoiceStatus.DISPUTED).count();

                long pending = invoiceRepository.findAll().stream()
                                .filter(i -> i.getStatus() != InvoiceStatus.PAID && i.getStatus() != InvoiceStatus.VOID)
                                .count();

                // Calculate Outstanding
                BigDecimal outstanding = invoiceRepository.findAll().stream()
                                .filter(i -> i.getStatus() != InvoiceStatus.PAID)
                                .map(i -> i.getAmountDue())
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                // Calculate Unallocated Cash
                BigDecimal unallocatedCash = paymentRepository.findAll().stream()
                                .filter(p -> p.getStatus() == PaymentStatus.UNALLOCATED
                                                || p.getStatus() == PaymentStatus.PARTIALLY_ALLOCATED)
                                .map(p -> p.getAmount().subtract(p.getAmountAllocated()))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                return new DashboardStats(totalInv, pending, overdue, disputed, outstanding, unallocatedCash);
        }

        @Transactional(readOnly = true)
        public List<MonthlyExpenseStats> getMonthlyExpenseTrends() {
                return invoiceRepository.getMonthlyExpenseStats();
        }

        @Transactional(readOnly = true)
        public List<VendorAgingStats> getVendorAgingReport() {
                return invoiceRepository.getVendorAgingReport();
        }
}
