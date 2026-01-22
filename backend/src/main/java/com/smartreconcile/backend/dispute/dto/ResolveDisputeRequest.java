package com.smartreconcile.backend.dispute.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResolveDisputeRequest {
    @NotNull
    private boolean approve; // true = Accepted (Valid), false = Rejected (Invalid)

    private String remarks;
}
