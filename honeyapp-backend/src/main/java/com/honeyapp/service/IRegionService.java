package com.honeyapp.service;

import com.honeyapp.dto.RegionReadOnlyDTO;

import java.util.List;

public interface IRegionService {
    List<RegionReadOnlyDTO> getAllRegions();
}
