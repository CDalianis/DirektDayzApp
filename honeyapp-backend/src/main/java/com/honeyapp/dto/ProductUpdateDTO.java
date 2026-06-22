package com.honeyapp.dto;

import com.honeyapp.model.HoneyType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductUpdateDTO(
        @NotNull UUID uuid,
        @NotBlank @Size(min = 2, max = 200) String name,
        @NotNull HoneyType honeyType,
        String description,
        @NotNull @DecimalMin("0.01") BigDecimal price,
        @NotNull @DecimalMin("0.01") BigDecimal quantityKg,
        @NotNull @Min(2000) @Max(2100) Integer harvestYear
) {}
