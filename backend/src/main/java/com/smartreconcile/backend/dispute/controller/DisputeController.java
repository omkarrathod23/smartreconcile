package com.smartreconcile.backend.dispute.controller;

import com.smartreconcile.backend.dispute.dto.RaiseDisputeRequest;
import com.smartreconcile.backend.dispute.dto.ResolveDisputeRequest;
import com.smartreconcile.backend.dispute.entity.Dispute;
import com.smartreconcile.backend.dispute.service.DisputeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/disputes")
public class DisputeController {

    @Autowired
    DisputeService disputeService;

    @PostMapping("/raise")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Dispute> raiseDispute(@Valid @RequestBody RaiseDisputeRequest request) {
        return ResponseEntity.ok(disputeService.raiseDispute(request));
    }

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasRole('FINANCE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Dispute> resolveDispute(@PathVariable Long id, @RequestBody ResolveDisputeRequest request) {
        return ResponseEntity.ok(disputeService.resolveDispute(id, request));
    }

    @GetMapping
    @PreAuthorize("hasRole('FINANCE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<Dispute>> getAllDisputes(Pageable pageable) {
        return ResponseEntity.ok(disputeService.getAllDisputes(pageable));
    }

    @GetMapping("/my-disputes/{vendorId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<Page<Dispute>> getMyDisputes(@PathVariable Long vendorId, Pageable pageable) {
        return ResponseEntity.ok(disputeService.getMyDisputes(vendorId, pageable));
    }
}
