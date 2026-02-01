package com.smartreconcile.backend.invoice.controller;

import com.smartreconcile.backend.invoice.dto.InvoiceRequest;
import com.smartreconcile.backend.invoice.dto.InvoiceResponse;
import com.smartreconcile.backend.invoice.entity.InvoiceStatus;
import com.smartreconcile.backend.invoice.service.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    InvoiceService invoiceService;

    @Autowired
    com.smartreconcile.backend.auth.security.SecurityUtils securityUtils;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('VENDOR') or hasRole('ACCOUNTS')")
    public ResponseEntity<InvoiceResponse> createInvoice(
            @RequestPart("invoice") @Valid InvoiceRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        if (!securityUtils.isVendorOwner(request.getVendorId())) {
            return ResponseEntity.status(403).build();
        }
        InvoiceResponse response = invoiceService.createInvoice(request, file);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ACCOUNTS') or hasRole('FINANCE_MANAGER')")
    public ResponseEntity<InvoiceResponse> updateInvoice(@PathVariable Long id,
            @Valid @RequestBody InvoiceRequest request) {
        return ResponseEntity.ok(invoiceService.updateInvoice(id, request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ACCOUNTS') or hasRole('FINANCE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<InvoiceResponse> getInvoiceById(@PathVariable Long id) {
        InvoiceResponse response = invoiceService.getInvoiceById(id);
        if (!securityUtils.isVendorOwner(response.getVendorId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ACCOUNTS') or hasRole('FINANCE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<InvoiceResponse>> getAllInvoices(
            @RequestParam(required = false) InvoiceStatus status,
            Pageable pageable) {
        if (status != null) {
            return ResponseEntity.ok(invoiceService.getInvoicesByStatus(status, pageable));
        }
        return ResponseEntity.ok(invoiceService.getAllInvoices(pageable));
    }

    @GetMapping("/my-invoices/{vendorId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ACCOUNTS') or hasRole('FINANCE_MANAGER')")
    public ResponseEntity<Page<InvoiceResponse>> getMyInvoices(@PathVariable Long vendorId, Pageable pageable) {
        if (!securityUtils.isVendorOwner(vendorId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(invoiceService.getInvoicesByVendor(vendorId, pageable));
    }
}
