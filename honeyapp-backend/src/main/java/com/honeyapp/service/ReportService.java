package com.honeyapp.service;

import com.honeyapp.dto.JobStatusDTO;
import com.honeyapp.dto.ProductInventoryReportView;
import com.honeyapp.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReportService implements IReportService {

    private final Map<String, JobStatusDTO> jobStatusMap = new ConcurrentHashMap<>();
    private final ProductRepository productRepository;

    @Override
    @Async
    @Transactional(readOnly = true)
    public void generateInventoryReport(String jobId) {
        jobStatusMap.put(jobId, JobStatusDTO.withoutData(jobId, "IN_PROGRESS"));
        try {
            List<ProductInventoryReportView> report = productRepository.findAll().stream()
                    .filter(p -> !p.isDeleted())
                    .map(p -> new ProductInventoryReportView(
                            p.getProducer().getBusinessName(),
                            p.getName(),
                            p.getHoneyType().name(),
                            p.getQuantityKg(),
                            p.getPrice()
                    ))
                    .toList();
            jobStatusMap.put(jobId, new JobStatusDTO(jobId, "COMPLETED", report));
            log.info("Inventory report generated for jobId={}, records={}", jobId, report.size());
        } catch (Exception e) {
            jobStatusMap.put(jobId, JobStatusDTO.withoutData(jobId, "FAILED"));
            log.error("Failed to generate report for jobId={}", jobId, e);
        }
    }

    @Override
    public JobStatusDTO getJobStatus(String jobId) {
        return jobStatusMap.get(jobId);
    }
}
