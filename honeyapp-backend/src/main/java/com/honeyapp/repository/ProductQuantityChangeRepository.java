package com.honeyapp.repository;

import com.honeyapp.model.ProductQuantityChange;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductQuantityChangeRepository extends JpaRepository<ProductQuantityChange, Long> {
}
