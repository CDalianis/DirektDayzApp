package com.honeyapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ProducerUpdateDTO(
        @NotNull UUID uuid,
        @NotBlank @Size(min = 2, max = 200) String businessName,
        @NotBlank @Size(min = 2) String ownerFirstname,
        @NotBlank @Size(min = 2) String ownerLastname,
        @Pattern(regexp = "\\d{9,}") String vat,
        @NotNull Long regionId,
        String description,
        @Valid @NotNull BusinessInfoUpdateDTO businessInfoUpdateDTO
) {}
