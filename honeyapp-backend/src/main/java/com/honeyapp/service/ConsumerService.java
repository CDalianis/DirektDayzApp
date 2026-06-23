package com.honeyapp.service;

import com.honeyapp.core.exceptions.EntityAlreadyExistsException;
import com.honeyapp.core.exceptions.EntityNotFoundException;
import com.honeyapp.dto.ConsumerInsertDTO;
import com.honeyapp.dto.ConsumerReadOnlyDTO;
import com.honeyapp.mapper.Mapper;
import com.honeyapp.model.Consumer;
import com.honeyapp.model.Role;
import com.honeyapp.model.User;
import com.honeyapp.repository.ConsumerRepository;
import com.honeyapp.repository.RoleRepository;
import com.honeyapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsumerService implements IConsumerService {

    private static final Long CONSUMER_ROLE_ID = 2L;

    private final ConsumerRepository consumerRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final Mapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(rollbackFor = EntityAlreadyExistsException.class)
    public ConsumerReadOnlyDTO saveConsumer(ConsumerInsertDTO dto) throws EntityAlreadyExistsException {
        if (userRepository.existsByUsername(dto.userInsertDTO().username())) {
            throw new EntityAlreadyExistsException("Username", "User with username " + dto.userInsertDTO().username() + " already exists");
        }

        Role role = roleRepository.findById(CONSUMER_ROLE_ID)
                .orElseThrow(() -> new EntityAlreadyExistsException("Role", "Consumer role not found"));

        Consumer consumer = mapper.mapToConsumerEntity(dto);
        User user = consumer.getUser();
        user.setPassword(passwordEncoder.encode(dto.userInsertDTO().password()));
        role.addUser(user);

        consumerRepository.save(consumer);
        log.info("Consumer {} {} saved successfully", dto.firstname(), dto.lastname());
        return mapper.mapToConsumerReadOnlyDTO(consumer);
    }

    @Override
    @PreAuthorize("hasAuthority('VIEW_OWN_CONSUMER') and @securityService.isOwnConsumerProfile(#uuid, authentication)")
    @Transactional(readOnly = true)
    public ConsumerReadOnlyDTO getConsumerByUuidDeletedFalse(UUID uuid) throws EntityNotFoundException {
        Consumer consumer = consumerRepository.findByUuidAndDeletedFalse(uuid)
                .orElseThrow(() -> new EntityNotFoundException("Consumer", "Consumer uuid=" + uuid + " not found"));
        return mapper.mapToConsumerReadOnlyDTO(consumer);
    }
}
