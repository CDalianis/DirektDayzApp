package com.honeyapp.service;

import com.honeyapp.dto.JobStatusDTO;

public interface IReportService {
    void generateInventoryReport(String jobId);
    JobStatusDTO getJobStatus(String jobId);
}
