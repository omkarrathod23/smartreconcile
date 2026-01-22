package com.smartreconcile.backend.reconciliation.service;

import com.smartreconcile.backend.reconciliation.dto.ReconciliationRequest;
import com.smartreconcile.backend.reconciliation.dto.ReconciliationResult;
import com.smartreconcile.backend.reconciliation.strategy.ExactMatchStrategy;
import com.smartreconcile.backend.reconciliation.strategy.FifoStrategy;
import com.smartreconcile.backend.reconciliation.strategy.ReconciliationStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReconciliationService {

    @Autowired
    ExactMatchStrategy exactMatchStrategy;

    @Autowired
    FifoStrategy fifoStrategy;

    public ReconciliationResult runReconciliation(ReconciliationRequest request) {
        ReconciliationStrategy strategy;

        switch (request.getStrategy()) {
            case "FIFO":
                strategy = fifoStrategy;
                break;
            case "EXACT_MATCH":
            default:
                strategy = exactMatchStrategy;
                break;
        }

        return strategy.reconcile(request.getTargetVendorId());
    }
}
