package com.honeyapp.core.filters;

import com.honeyapp.model.HoneyType;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductFilters {
    private UUID uuid;
    private HoneyType honeyType;
    private String name;
    private String region;
    private UUID producerUuid;
    private boolean deleted;
}
