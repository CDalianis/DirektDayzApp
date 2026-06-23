package com.honeyapp.service;

import com.honeyapp.dto.RegionReadOnlyDTO;
import com.honeyapp.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionService implements IRegionService {

    private final RegionRepository regionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RegionReadOnlyDTO> getAllRegions() {
        return regionRepository.findAll().stream()
                .map(r -> new RegionReadOnlyDTO(r.getId(), r.getName()))
                .toList();
    }
}
