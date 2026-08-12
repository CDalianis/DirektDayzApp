package com.honeyapp.dto;

import com.honeyapp.model.QuantityChangeReason;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductQuantityUpdateDTO(
        @NotNull UUID uuid,
        @NotNull @DecimalMin("0.01") BigDecimal quantityKg,
        @NotNull QuantityChangeReason reason
) {}
