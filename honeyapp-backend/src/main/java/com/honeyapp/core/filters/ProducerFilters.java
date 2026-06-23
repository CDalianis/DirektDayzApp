package com.honeyapp.core.filters;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProducerFilters {
    private UUID uuid;
    private String vat;
    private String businessName;
    private String region;
    private boolean deleted;
}
