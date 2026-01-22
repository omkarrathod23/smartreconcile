package com.smartreconcile.backend.reconciliation.strategy;

import com.smartreconcile.backend.reconciliation.dto.ReconciliationResult;

public interface ReconciliationStrategy {
    ReconciliationResult reconcile(Long vendorId);
}
