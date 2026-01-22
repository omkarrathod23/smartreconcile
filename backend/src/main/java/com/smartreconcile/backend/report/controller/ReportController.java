package com.smartreconcile.backend.report.controller;

import com.smartreconcile.backend.report.dto.DashboardStats;
import com.smartreconcile.backend.report.dto.MonthlyExpenseStats;
import com.smartreconcile.backend.report.dto.VendorAgingStats;
import com.smartreconcile.backend.report.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    ReportService reportService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('FINANCE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(reportService.getDashboardStats());
    }

    @GetMapping("/monthly-trends")
    @PreAuthorize("hasRole('FINANCE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<MonthlyExpenseStats>> getMonthlyTrends() {
        return ResponseEntity.ok(reportService.getMonthlyExpenseTrends());
    }

    @GetMapping("/vendor-aging")
    @PreAuthorize("hasRole('FINANCE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<VendorAgingStats>> getVendorAgingReport() {
        return ResponseEntity.ok(reportService.getVendorAgingReport());
    }
}
