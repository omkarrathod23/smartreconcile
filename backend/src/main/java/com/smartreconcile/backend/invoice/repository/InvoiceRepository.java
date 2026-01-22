package com.smartreconcile.backend.invoice.repository;

import com.smartreconcile.backend.invoice.entity.Invoice;
import com.smartreconcile.backend.invoice.entity.InvoiceStatus;
import com.smartreconcile.backend.report.dto.MonthlyExpenseStats;
import com.smartreconcile.backend.report.dto.VendorAgingStats;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByVendorIdAndInvoiceNumber(Long vendorId, String invoiceNumber);

    Page<Invoice> findByStatus(InvoiceStatus status, Pageable pageable);

    Page<Invoice> findByVendorId(Long vendorId, Pageable pageable);

    // REPORTING: Monthly Expense Trend (Group By Year/Month) - Optimizing for
    // Postgres/H2
    @Query("SELECT new com.smartreconcile.backend.report.dto.MonthlyExpenseStats(" +
            "CAST(EXTRACT(YEAR FROM i.issueDate) AS int), " +
            "CAST(EXTRACT(MONTH FROM i.issueDate) AS int), " +
            "SUM(i.amountTotal), COUNT(i)) " +
            "FROM Invoice i " +
            "WHERE i.status <> 'VOID' " +
            "GROUP BY EXTRACT(YEAR FROM i.issueDate), EXTRACT(MONTH FROM i.issueDate) " +
            "ORDER BY EXTRACT(YEAR FROM i.issueDate) DESC, EXTRACT(MONTH FROM i.issueDate) DESC")
    List<MonthlyExpenseStats> getMonthlyExpenseStats();

    // REPORTING: Vendor Aging (Aggregated Due Amounts)
    // Aggregates total due per vendor and counts how many are strictly 'OVERDUE'
    @Query("SELECT new com.smartreconcile.backend.report.dto.VendorAgingStats(" +
            "v.id, v.name, SUM(i.amountDue), " +
            "SUM(CASE WHEN i.status = 'OVERDUE' THEN 1 ELSE 0 END)) " +
            "FROM Invoice i JOIN i.vendor v " +
            "WHERE i.status IN ('PENDING', 'PARTIALLY_PAID', 'OVERDUE') " +
            "GROUP BY v.id, v.name " +
            "ORDER BY SUM(i.amountDue) DESC")
    List<VendorAgingStats> getVendorAgingReport();
}
