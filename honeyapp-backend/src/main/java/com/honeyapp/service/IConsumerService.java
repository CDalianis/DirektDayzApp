package com.honeyapp.service;

import com.honeyapp.core.exceptions.EntityAlreadyExistsException;
import com.honeyapp.core.exceptions.EntityNotFoundException;
import com.honeyapp.dto.ConsumerInsertDTO;
import com.honeyapp.dto.ConsumerReadOnlyDTO;

import java.util.UUID;

public interface IConsumerService {
    ConsumerReadOnlyDTO saveConsumer(ConsumerInsertDTO dto) throws EntityAlreadyExistsException;

    ConsumerReadOnlyDTO getConsumerByUuidDeletedFalse(UUID uuid) throws EntityNotFoundException;
}
