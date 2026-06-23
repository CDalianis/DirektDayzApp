package com.honeyapp.api;

import com.honeyapp.core.exceptions.*;
import com.honeyapp.core.filters.ProducerFilters;
import com.honeyapp.dto.*;
import com.honeyapp.service.IProducerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/producers")
@RequiredArgsConstructor
public class ProducerRestController {

    private final IProducerService producerService;

    @PostMapping
    public ResponseEntity<ProducerReadOnlyDTO> saveProducer(
            @Valid @RequestBody ProducerInsertDTO dto,
            BindingResult bindingResult)
            throws EntityAlreadyExistsException, EntityInvalidArgumentException, ValidationException {

        if (bindingResult.hasErrors()) {
            throw new ValidationException("Producer", "Invalid producer data", bindingResult);
        }

        ProducerReadOnlyDTO saved = producerService.saveProducer(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{uuid}")
                .buildAndExpand(saved.uuid())
                .toUri();
        return ResponseEntity.created(location).body(saved);
    }

    @PostMapping("/{uuid}/certification-file")
    public ResponseEntity<Void> uploadCertificationFile(
            @PathVariable UUID uuid,
            @RequestParam("file") MultipartFile file)
            throws EntityNotFoundException, FileUploadException {
        producerService.saveCertificationFile(uuid, file);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ProducerReadOnlyDTO> updateProducer(
            @PathVariable UUID uuid,
            @Valid @RequestBody ProducerUpdateDTO dto,
            BindingResult bindingResult)
            throws EntityNotFoundException, EntityAlreadyExistsException, EntityInvalidArgumentException, ValidationException {

        if (!uuid.equals(dto.uuid())) {
            throw new EntityInvalidArgumentException("Producer", "Path uuid does not match body uuid");
        }
        if (bindingResult.hasErrors()) {
            throw new ValidationException("Producer", "Invalid producer data", bindingResult);
        }
        return ResponseEntity.ok(producerService.updateProducer(dto));
    }

    @GetMapping
    public ResponseEntity<Page<ProducerReadOnlyDTO>> getProducers(
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @ModelAttribute ProducerFilters filters) throws EntityNotFoundException {
        return ResponseEntity.ok(producerService.getProducersPaginatedFiltered(pageable, filters));
    }

    @GetMapping("/me")
    public ResponseEntity<ProducerReadOnlyDTO> getMyProducer() throws EntityNotFoundException {
        return ResponseEntity.ok(producerService.getMyProducerProfile());
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<ProducerReadOnlyDTO> getProducer(@PathVariable UUID uuid)
            throws EntityNotFoundException {
        return ResponseEntity.ok(producerService.getProducerByUuidDeletedFalse(uuid));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<ProducerReadOnlyDTO> deleteProducer(@PathVariable UUID uuid)
            throws EntityNotFoundException {
        return ResponseEntity.ok(producerService.deleteProducerByUuid(uuid));
    }
}
