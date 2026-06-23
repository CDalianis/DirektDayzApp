package com.honeyapp.api;

import com.honeyapp.dto.JobStatusDTO;
import com.honeyapp.service.IReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportRestController {

    private final IReportService reportService;

    @PostMapping("/inventory")
    public ResponseEntity<Map<String, String>> startInventoryReport() {
        String jobId = UUID.randomUUID().toString();
        reportService.generateInventoryReport(jobId);
        return ResponseEntity.accepted().body(Map.of("jobId", jobId));
    }

    @GetMapping("/inventory/{jobId}")
    public ResponseEntity<JobStatusDTO> getInventoryReport(@PathVariable String jobId) {
        JobStatusDTO status = reportService.getJobStatus(jobId);
        if (status == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(status);
    }
}
