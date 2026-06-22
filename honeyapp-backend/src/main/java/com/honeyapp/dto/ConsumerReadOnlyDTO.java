package com.honeyapp.dto;

public record ConsumerReadOnlyDTO(
        String uuid,
        String firstname,
        String lastname,
        String address,
        String phone
) {}
