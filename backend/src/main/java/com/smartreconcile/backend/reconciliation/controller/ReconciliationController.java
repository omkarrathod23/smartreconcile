package com.smartreconcile.backend.reconciliation.controller;

import com.smartreconcile.backend.reconciliation.dto.ReconciliationRequest;
import com.smartreconcile.backend.reconciliation.dto.ReconciliationResult;
import com.smartreconcile.backend.reconciliation.service.ReconciliationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reconciliation")
public class ReconciliationController {

    @Autowired
    ReconciliationService reconciliationService;

    @PostMapping("/run")
    @PreAuthorize("hasRole('FINANCE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<ReconciliationResult> runReconciliation(@RequestBody ReconciliationRequest request) {
        return ResponseEntity.ok(reconciliationService.runReconciliation(request));
    }
}
