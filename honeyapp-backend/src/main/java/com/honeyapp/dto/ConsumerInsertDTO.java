package com.honeyapp.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ConsumerInsertDTO(
        @NotBlank @Size(min = 2) String firstname,
        @NotBlank @Size(min = 2) String lastname,
        @NotBlank @Size(max = 255) String address,
        @NotBlank @Size(max = 30) String phone,
        @Valid @NotNull UserInsertDTO userInsertDTO
) {}
