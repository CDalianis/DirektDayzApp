package com.honeyapp.api;

import com.honeyapp.dto.RegionReadOnlyDTO;
import com.honeyapp.service.IRegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/regions")
@RequiredArgsConstructor
public class RegionRestController {

    private final IRegionService regionService;

    @GetMapping
    public ResponseEntity<List<RegionReadOnlyDTO>> getRegions() {
        return ResponseEntity.ok(regionService.getAllRegions());
    }
}
