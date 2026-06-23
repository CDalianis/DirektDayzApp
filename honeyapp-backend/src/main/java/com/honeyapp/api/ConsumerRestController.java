package com.honeyapp.api;

import com.honeyapp.core.exceptions.EntityAlreadyExistsException;
import com.honeyapp.core.exceptions.EntityNotFoundException;
import com.honeyapp.core.exceptions.ValidationException;
import com.honeyapp.dto.ConsumerInsertDTO;
import com.honeyapp.dto.ConsumerReadOnlyDTO;
import com.honeyapp.service.IConsumerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/consumers")
@RequiredArgsConstructor
public class ConsumerRestController {

    private final IConsumerService consumerService;

    @PostMapping
    public ResponseEntity<ConsumerReadOnlyDTO> saveConsumer(
            @Valid @RequestBody ConsumerInsertDTO dto,
            BindingResult bindingResult) throws EntityAlreadyExistsException, ValidationException {

        if (bindingResult.hasErrors()) {
            throw new ValidationException("Consumer", "Invalid consumer data", bindingResult);
        }

        ConsumerReadOnlyDTO saved = consumerService.saveConsumer(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{uuid}")
                .buildAndExpand(saved.uuid())
                .toUri();
        return ResponseEntity.created(location).body(saved);
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<ConsumerReadOnlyDTO> getConsumer(@PathVariable UUID uuid)
            throws EntityNotFoundException {
        return ResponseEntity.ok(consumerService.getConsumerByUuidDeletedFalse(uuid));
    }
}
