package com.honeyapp.service;

import com.honeyapp.core.exceptions.*;
import com.honeyapp.core.filters.ProducerFilters;
import com.honeyapp.dto.ProducerInsertDTO;
import com.honeyapp.dto.ProducerReadOnlyDTO;
import com.honeyapp.dto.ProducerUpdateDTO;
import com.honeyapp.mapper.Mapper;
import com.honeyapp.model.*;
import com.honeyapp.model.staticdata.Region;
import com.honeyapp.repository.ProducerRepository;
import com.honeyapp.repository.RegionRepository;
import com.honeyapp.repository.RoleRepository;
import com.honeyapp.repository.UserRepository;
import com.honeyapp.specification.ProducerSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProducerService implements IProducerService {

    private static final Long PRODUCER_ROLE_ID = 3L;

    private final ProducerRepository producerRepository;
    private final RegionRepository regionRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final Mapper mapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Override
    @Transactional(rollbackFor = {EntityAlreadyExistsException.class, EntityInvalidArgumentException.class})
    public ProducerReadOnlyDTO saveProducer(ProducerInsertDTO dto)
            throws EntityAlreadyExistsException, EntityInvalidArgumentException {

        if (dto.vat() != null && producerRepository.findByVat(dto.vat()).isPresent()) {
            throw new EntityAlreadyExistsException("Producer", "Producer with vat=" + dto.vat() + " already exists");
        }
        if (userRepository.existsByUsername(dto.userInsertDTO().username())) {
            throw new EntityAlreadyExistsException("Username", "User with username " + dto.userInsertDTO().username() + " already exists");
        }

        Region region = regionRepository.findById(dto.regionId())
                .orElseThrow(() -> new EntityInvalidArgumentException("Region", "Region id=" + dto.regionId() + " invalid"));

        Role role = roleRepository.findById(PRODUCER_ROLE_ID)
                .orElseThrow(() -> new EntityInvalidArgumentException("Role", "Producer role not found"));

        Producer producer = mapper.mapToProducerEntity(dto);
        User user = producer.getUser();
        user.setPassword(passwordEncoder.encode(dto.userInsertDTO().password()));
        region.addProducer(producer);
        role.addUser(user);

        producerRepository.save(producer);
        log.info("Producer {} saved successfully", dto.businessName());
        return mapper.mapToProducerReadOnlyDTO(producer);
    }

    @Override
    @PreAuthorize("hasAuthority('EDIT_PRODUCER') or (hasAuthority('EDIT_OWN_PRODUCER') and @securityService.isOwnProducerProfile(#dto.uuid(), authentication))")
    @Transactional(rollbackFor = {EntityNotFoundException.class, EntityAlreadyExistsException.class, EntityInvalidArgumentException.class})
    public ProducerReadOnlyDTO updateProducer(ProducerUpdateDTO dto)
            throws EntityNotFoundException, EntityAlreadyExistsException, EntityInvalidArgumentException {

        Producer producer = producerRepository.findByUuidAndDeletedFalse(dto.uuid())
                .orElseThrow(() -> new EntityNotFoundException("Producer", "Producer uuid=" + dto.uuid() + " not found"));

        producer.setBusinessName(dto.businessName());
        producer.setOwnerFirstname(dto.ownerFirstname());
        producer.setOwnerLastname(dto.ownerLastname());
        producer.setDescription(dto.description());

        if (dto.vat() != null && !Objects.equals(producer.getVat(), dto.vat())) {
            if (producerRepository.findByVat(dto.vat()).isPresent()) {
                throw new EntityAlreadyExistsException("Producer", "Producer with vat=" + dto.vat() + " already exists");
            }
            producer.setVat(dto.vat());
        }

        if (!Objects.equals(dto.regionId(), producer.getRegion().getId())) {
            Region region = regionRepository.findById(dto.regionId())
                    .orElseThrow(() -> new EntityInvalidArgumentException("Region", "Region id=" + dto.regionId() + " invalid"));
            Region oldRegion = producer.getRegion();
            if (oldRegion != null) {
                oldRegion.removeProducer(producer);
            }
            region.addProducer(producer);
        }

        BusinessInfo info = producer.getBusinessInfo();
        info.setTaxId(dto.businessInfoUpdateDTO().taxId());
        info.setAddress(dto.businessInfoUpdateDTO().address());
        info.setPhone(dto.businessInfoUpdateDTO().phone());
        info.setOrganicCertNumber(dto.businessInfoUpdateDTO().organicCertNumber());

        producerRepository.save(producer);
        return mapper.mapToProducerReadOnlyDTO(producer);
    }

    @Override
    @PreAuthorize("hasAuthority('DELETE_PRODUCER')")
    @Transactional(rollbackFor = EntityNotFoundException.class)
    public ProducerReadOnlyDTO deleteProducerByUuid(UUID uuid) throws EntityNotFoundException {
        Producer producer = producerRepository.findByUuidAndDeletedFalse(uuid)
                .orElseThrow(() -> new EntityNotFoundException("Producer", "Producer uuid=" + uuid + " not found"));

        producer.softDelete();
        producer.getBusinessInfo().softDelete();
        producer.getUser().softDelete();

        return mapper.mapToProducerReadOnlyDTO(producer);
    }

    @Override
    @Transactional(readOnly = true)
    public ProducerReadOnlyDTO getProducerByUuidDeletedFalse(UUID uuid) throws EntityNotFoundException {
        Producer producer = producerRepository.findByUuidAndDeletedFalse(uuid)
                .orElseThrow(() -> new EntityNotFoundException("Producer", "Producer uuid=" + uuid + " not found"));
        return mapper.mapToProducerReadOnlyDTO(producer);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProducerReadOnlyDTO> getProducersPaginatedFiltered(Pageable pageable, ProducerFilters filters)
            throws EntityNotFoundException {

        if (filters.getUuid() != null) {
            Producer producer = producerRepository.findByUuidAndDeletedFalse(filters.getUuid())
                    .orElseThrow(() -> new EntityNotFoundException("Producer", "uuid=" + filters.getUuid() + " not found"));
            return singleResultPage(producer, pageable);
        }

        if (filters.getVat() != null) {
            Producer producer = producerRepository.findByVat(filters.getVat())
                    .orElseThrow(() -> new EntityNotFoundException("Producer", "vat=" + filters.getVat() + " not found"));
            return singleResultPage(producer, pageable);
        }

        Page<Producer> page = producerRepository.findAll(ProducerSpecification.build(filters), pageable);
        return page.map(mapper::mapToProducerReadOnlyDTO);
    }

    @Override
    @PreAuthorize("hasAuthority('VIEW_OWN_PRODUCER')")
    @Transactional(readOnly = true)
    public ProducerReadOnlyDTO getMyProducerProfile() throws EntityNotFoundException {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Producer producer = producerRepository.findByUser_Uuid(user.getUuid())
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new EntityNotFoundException("Producer", "Producer profile not found for current user"));
        return mapper.mapToProducerReadOnlyDTO(producer);
    }

    @Override
    @Retryable(retryFor = {IOException.class, HttpServerErrorException.class},
            maxAttempts = 3, backoff = @Backoff(delay = 2000, multiplier = 2, maxDelay = 10000))
    @Transactional(rollbackFor = EntityNotFoundException.class)
    public void saveCertificationFile(UUID uuid, MultipartFile file)
            throws FileUploadException, EntityNotFoundException {
        try {
            String originalFilename = file.getOriginalFilename();
            String savedName = UUID.randomUUID() + getFileExtension(originalFilename);
            Path filePath = Paths.get(uploadDir + savedName);

            Files.createDirectories(filePath.getParent());
            file.transferTo(filePath);

            Attachment attachment = new Attachment();
            attachment.setFilename(originalFilename);
            attachment.setSavedName(savedName);
            attachment.setFilePath(filePath.toString());
            attachment.setContentType(new Tika().detect(file.getBytes()));
            attachment.setExtension(getFileExtension(originalFilename));

            Producer producer = producerRepository.findByUuid(uuid)
                    .orElseThrow(() -> new EntityNotFoundException("Producer", "Producer uuid=" + uuid + " not found"));

            BusinessInfo info = producer.getBusinessInfo();
            if (info.getCertificationFile() != null) {
                Files.deleteIfExists(Path.of(info.getCertificationFile().getFilePath()));
                info.removeCertificationFile();
            }
            info.addCertificationFile(attachment);
            producerRepository.save(producer);
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (IOException | HttpServerErrorException e) {
            throw new FileUploadException("Certification", "Error saving certification file for producer uuid=" + uuid);
        }
    }

    private Page<ProducerReadOnlyDTO> singleResultPage(Producer producer, Pageable pageable) {
        return new PageImpl<>(List.of(mapper.mapToProducerReadOnlyDTO(producer)), pageable, 1);
    }

    private String getFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return "";
    }
}
