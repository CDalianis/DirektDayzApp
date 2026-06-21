package com.honeyapp.repository;

import com.honeyapp.model.Consumer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ConsumerRepository extends JpaRepository<Consumer, Long> {
    Optional<Consumer> findByUuid(UUID uuid);
    Optional<Consumer> findByUuidAndDeletedFalse(UUID uuid);
    boolean existsByUuidAndUser_Uuid(UUID consumerUuid, UUID userUuid);
}
