package com.honeyapp.service;

import com.honeyapp.core.exceptions.*;
import com.honeyapp.core.filters.ProducerFilters;
import com.honeyapp.dto.ProducerInsertDTO;
import com.honeyapp.dto.ProducerReadOnlyDTO;
import com.honeyapp.dto.ProducerUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface IProducerService {
    ProducerReadOnlyDTO saveProducer(ProducerInsertDTO dto)
            throws EntityAlreadyExistsException, EntityInvalidArgumentException;

    ProducerReadOnlyDTO updateProducer(ProducerUpdateDTO dto)
            throws EntityNotFoundException, EntityAlreadyExistsException, EntityInvalidArgumentException;

    ProducerReadOnlyDTO deleteProducerByUuid(UUID uuid) throws EntityNotFoundException;

    ProducerReadOnlyDTO getProducerByUuidDeletedFalse(UUID uuid) throws EntityNotFoundException;

    Page<ProducerReadOnlyDTO> getProducersPaginatedFiltered(Pageable pageable, ProducerFilters filters)
            throws EntityNotFoundException;

    ProducerReadOnlyDTO getMyProducerProfile() throws EntityNotFoundException;

    void saveCertificationFile(UUID uuid, MultipartFile file)
            throws FileUploadException, EntityNotFoundException;
}
