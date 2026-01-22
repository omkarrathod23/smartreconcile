package com.smartreconcile.backend.invoice.service;

import com.smartreconcile.backend.invoice.dto.InvoiceRequest;
import com.smartreconcile.backend.invoice.dto.InvoiceResponse;
import com.smartreconcile.backend.invoice.entity.Invoice;
import com.smartreconcile.backend.invoice.entity.InvoiceStatus;
import com.smartreconcile.backend.invoice.repository.InvoiceRepository;
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
public class InvoiceService {

    @Autowired
    InvoiceRepository invoiceRepository;

    @Autowired
    VendorRepository vendorRepository;

    @Transactional
    public InvoiceResponse createInvoice(InvoiceRequest request) {
        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        if (invoiceRepository.findByVendorIdAndInvoiceNumber(request.getVendorId(), request.getInvoiceNumber())
                .isPresent()) {
            throw new RuntimeException("Invoice number already exists for this vendor");
        }

        Invoice invoice = new Invoice();
        BeanUtils.copyProperties(request, invoice);
        invoice.setVendor(vendor);
        invoice.setAmountPaid(BigDecimal.ZERO);
        invoice.setStatus(InvoiceStatus.CREATED);
        invoice.calculateDue();

        Invoice saved = invoiceRepository.save(invoice);
        return mapToResponse(saved);
    }

    public Page<InvoiceResponse> getAllInvoices(Pageable pageable) {
        return invoiceRepository.findAll(pageable).map(this::mapToResponse);
    }

    public Page<InvoiceResponse> getInvoicesByStatus(InvoiceStatus status, Pageable pageable) {
        return invoiceRepository.findByStatus(status, pageable).map(this::mapToResponse);
    }

    public Page<InvoiceResponse> getInvoicesByVendor(Long vendorId, Pageable pageable) {
        return invoiceRepository.findByVendorId(vendorId, pageable).map(this::mapToResponse);
    }

    public InvoiceResponse getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return mapToResponse(invoice);
    }

    @Transactional
    public InvoiceResponse updateInvoice(Long id, InvoiceRequest request) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        BeanUtils.copyProperties(request, invoice, "id", "status", "amountPaid");
        invoice.calculateDue();
        
        Invoice updated = invoiceRepository.save(invoice);
        return mapToResponse(updated);
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {
        InvoiceResponse response = new InvoiceResponse();
        BeanUtils.copyProperties(invoice, response);
        response.setVendorName(invoice.getVendor().getName());
        return response;
    }
}
