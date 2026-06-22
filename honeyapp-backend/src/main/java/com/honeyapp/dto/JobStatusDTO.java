package com.honeyapp.dto;

import java.util.List;

public record JobStatusDTO(String jobId, String status, List<ProductInventoryReportView> data) {
    public static JobStatusDTO withoutData(String jobId, String status) {
        return new JobStatusDTO(jobId, status, null);
    }
}
