package com.honeyapp.dto;

public record ProducerReadOnlyDTO(
        String uuid,
        String businessName,
        String ownerFirstname,
        String ownerLastname,
        String vat,
        String region,
        String description,
        String address,
        String phone,
        String organicCertNumber
) {}
