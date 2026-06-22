package com.honeyapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BusinessInfoInsertDTO(
        String taxId,
        @NotBlank @Size(max = 255) String address,
        @NotBlank @Size(max = 30) String phone,
        String organicCertNumber
) {}
