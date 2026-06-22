package com.honeyapp.dto;

import java.math.BigDecimal;

public record ProductInventoryReportView(
        String producerBusinessName,
        String productName,
        String honeyType,
        BigDecimal quantityKg,
        BigDecimal price
) {}
