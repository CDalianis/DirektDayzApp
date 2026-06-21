package com.honeyapp.repository;

import com.honeyapp.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findByUuid(UUID uuid);
    Optional<Product> findByUuidAndDeletedFalse(UUID uuid);
    List<Product> findAllByProducer_UuidAndDeletedFalse(UUID producerUuid);
}
