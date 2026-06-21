package com.honeyapp.repository;

import com.honeyapp.model.staticdata.Region;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegionRepository extends JpaRepository<Region, Long> {
}
