package com.honeyapp.repository;

import com.honeyapp.model.Producer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface ProducerRepository extends JpaRepository<Producer, Long>, JpaSpecificationExecutor<Producer> {
    Optional<Producer> findByUuid(UUID uuid);
    Optional<Producer> findByUuidAndDeletedFalse(UUID uuid);
    Optional<Producer> findByVat(String vat);
    Optional<Producer> findByUser_Uuid(UUID userUuid);
    boolean existsByUuidAndUser_Uuid(UUID producerUuid, UUID userUuid);
}
