package com.honeyapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthenticationRequestDTO(
        @NotBlank String username,
        @NotBlank String password
) {}
