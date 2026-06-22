package com.honeyapp.dto;

import com.honeyapp.model.HoneyType;

import java.math.BigDecimal;

public record ProductReadOnlyDTO(
        String uuid,
        String name,
        HoneyType honeyType,
        String description,
        BigDecimal price,
        BigDecimal quantityKg,
        Integer harvestYear,
        String producerUuid,
        String producerBusinessName,
        String region
) {}
