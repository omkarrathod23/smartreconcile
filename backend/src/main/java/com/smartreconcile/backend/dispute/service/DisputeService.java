package com.smartreconcile.backend.dispute.service;

import com.smartreconcile.backend.dispute.dto.RaiseDisputeRequest;
import com.smartreconcile.backend.dispute.dto.ResolveDisputeRequest;
import com.smartreconcile.backend.dispute.entity.Dispute;
import com.smartreconcile.backend.dispute.entity.DisputeStatus;
import com.smartreconcile.backend.dispute.repository.DisputeRepository;
import com.smartreconcile.backend.invoice.entity.Invoice;
import com.smartreconcile.backend.invoice.entity.InvoiceStatus;
import com.smartreconcile.backend.invoice.repository.InvoiceRepository;
import com.smartreconcile.backend.vendor.entity.Vendor;
import com.smartreconcile.backend.vendor.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DisputeService {

    @Autowired
    DisputeRepository disputeRepository;

    @Autowired
    InvoiceRepository invoiceRepository;

    @Autowired
    VendorRepository vendorRepository;

    @Transactional
    public Dispute raiseDispute(RaiseDisputeRequest request) {
        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            // For MVP, potentially block disputes on already paid items, or allow with
            // warning?
            // Let's allow but it implies a refund request.
        }

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        if (!invoice.getVendor().getId().equals(vendor.getId())) {
            throw new RuntimeException("Cannot dispute another vendor's invoice");
        }

        // Check if open dispute exists
        if (disputeRepository.findByInvoiceIdAndStatus(invoice.getId(), DisputeStatus.OPEN).isPresent()) {
            throw new RuntimeException("An open dispute already exists for this invoice");
        }

        Dispute dispute = new Dispute();
        dispute.setInvoice(invoice);
        dispute.setRaisedBy(vendor);
        dispute.setReason(request.getReason());
        dispute.setDescription(request.getDescription());
        dispute.setStatus(DisputeStatus.OPEN);

        // Update Invoice Status to Lock it
        invoice.setStatus(InvoiceStatus.DISPUTED);
        invoiceRepository.save(invoice);

        return disputeRepository.save(dispute);
    }

    @Transactional
    public Dispute resolveDispute(Long disputeId, ResolveDisputeRequest request) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));

        if (dispute.getStatus() != DisputeStatus.OPEN && dispute.getStatus() != DisputeStatus.IN_PROGRESS) {
            throw new RuntimeException("Dispute is already closed");
        }

        Invoice invoice = dispute.getInvoice();

        if (request.isApprove()) {
            // Admin accepts the dispute is VALID.
            dispute.setStatus(DisputeStatus.RESOLVED);
            invoice.setStatus(InvoiceStatus.RESOLVED); // Or VOID / OVERPAID depending on logic
            // In a real system, this might trigger a Credit Note generation
        } else {
            // Admin REJECTS the dispute. Invoice was correct.
            dispute.setStatus(DisputeStatus.REJECTED);

            // Revert Invoice Status
            if (invoice.getAmountPaid().compareTo(java.math.BigDecimal.ZERO) > 0) {
                invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
            } else {
                invoice.setStatus(InvoiceStatus.CREATED); // Or PENDING
            }
        }

        dispute.setResolutionRemarks(request.getRemarks());
        invoiceRepository.save(invoice);
        return disputeRepository.save(dispute);
    }

    public Page<Dispute> getAllDisputes(Pageable pageable) {
        return disputeRepository.findAll(pageable);
    }

    public Page<Dispute> getMyDisputes(Long vendorId, Pageable pageable) {
        return disputeRepository.findByRaisedById(vendorId, pageable);
    }
}
