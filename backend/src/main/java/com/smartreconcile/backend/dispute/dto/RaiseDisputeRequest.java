package com.smartreconcile.backend.dispute.dto;

import com.smartreconcile.backend.dispute.entity.DisputeReason;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RaiseDisputeRequest {
    @NotNull
    private Long invoiceId;

    @NotNull
    private Long vendorId; // Current Logged In Vendor

    @NotNull
    private DisputeReason reason;

    private String description;
}
