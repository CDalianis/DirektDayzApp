package com.honeyapp.service;

import com.honeyapp.core.exceptions.EntityInvalidArgumentException;
import com.honeyapp.core.exceptions.EntityNotFoundException;
import com.honeyapp.core.filters.ProductFilters;
import com.honeyapp.dto.ProductInsertDTO;
import com.honeyapp.dto.ProductQuantityUpdateDTO;
import com.honeyapp.dto.ProductReadOnlyDTO;
import com.honeyapp.dto.ProductUpdateDTO;
import com.honeyapp.mapper.Mapper;
import com.honeyapp.model.Producer;
import com.honeyapp.model.Product;
import com.honeyapp.model.ProductQuantityChange;
import com.honeyapp.model.QuantityChangeReason;
import com.honeyapp.repository.ProducerRepository;
import com.honeyapp.repository.ProductQuantityChangeRepository;
import com.honeyapp.repository.ProductRepository;
import com.honeyapp.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService implements IProductService {

    private final ProductRepository productRepository;
    private final ProducerRepository producerRepository;
    private final ProductQuantityChangeRepository productQuantityChangeRepository;
    private final Mapper mapper;

    @Override
    @PreAuthorize("hasAuthority('MANAGE_OWN_PRODUCTS') and @securityService.isOwnProducerProfile(#dto.producerUuid(), authentication)")
    @Transactional(rollbackFor = EntityNotFoundException.class)
    public ProductReadOnlyDTO saveProduct(ProductInsertDTO dto) throws EntityNotFoundException {
        Producer producer = producerRepository.findByUuidAndDeletedFalse(dto.producerUuid())
                .orElseThrow(() -> new EntityNotFoundException("Producer", "Producer uuid=" + dto.producerUuid() + " not found"));

        Product product = mapper.mapToProductEntity(dto, producer);
        productRepository.save(product);
        log.info("Product {} saved for producer {}", dto.name(), dto.producerUuid());
        return mapper.mapToProductReadOnlyDTO(product);
    }

    @Override
    @PreAuthorize("hasAuthority('MANAGE_OWN_PRODUCTS') and @securityService.isOwnProduct(#dto.uuid(), authentication)")
    @Transactional(rollbackFor = {EntityNotFoundException.class, EntityInvalidArgumentException.class})
    public ProductReadOnlyDTO updateProduct(ProductUpdateDTO dto)
            throws EntityNotFoundException, EntityInvalidArgumentException {
        Product product = productRepository.findByUuidAndDeletedFalse(dto.uuid())
                .orElseThrow(() -> new EntityNotFoundException("Product", "Product uuid=" + dto.uuid() + " not found"));

        applyQuantityChange(product, dto.quantityKg(), dto.quantityChangeReason());

        product.setName(dto.name());
        product.setHoneyType(dto.honeyType());
        product.setDescription(dto.description());
        product.setPrice(dto.price());
        product.setHarvestYear(dto.harvestYear());

        productRepository.save(product);
        return mapper.mapToProductReadOnlyDTO(product);
    }

    @Override
    @PreAuthorize("hasAuthority('MANAGE_OWN_PRODUCTS') and @securityService.isOwnProduct(#dto.uuid(), authentication)")
    @Transactional(rollbackFor = {EntityNotFoundException.class, EntityInvalidArgumentException.class})
    public ProductReadOnlyDTO updateProductQuantity(ProductQuantityUpdateDTO dto)
            throws EntityNotFoundException, EntityInvalidArgumentException {
        Product product = productRepository.findByUuidAndDeletedFalse(dto.uuid())
                .orElseThrow(() -> new EntityNotFoundException("Product", "Product uuid=" + dto.uuid() + " not found"));

        applyQuantityChange(product, dto.quantityKg(), dto.reason());
        productRepository.save(product);
        log.info("Product {} quantity updated to {} kg ({})", dto.uuid(), dto.quantityKg(), dto.reason());
        return mapper.mapToProductReadOnlyDTO(product);
    }

    @Override
    @PreAuthorize("hasAuthority('MANAGE_OWN_PRODUCTS') and @securityService.isOwnProduct(#uuid, authentication)")
    @Transactional(rollbackFor = EntityNotFoundException.class)
    public ProductReadOnlyDTO deleteProductByUuid(UUID uuid) throws EntityNotFoundException {
        Product product = productRepository.findByUuidAndDeletedFalse(uuid)
                .orElseThrow(() -> new EntityNotFoundException("Product", "Product uuid=" + uuid + " not found"));
        product.softDelete();
        return mapper.mapToProductReadOnlyDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductReadOnlyDTO getProductByUuidDeletedFalse(UUID uuid) throws EntityNotFoundException {
        Product product = productRepository.findByUuidAndDeletedFalse(uuid)
                .orElseThrow(() -> new EntityNotFoundException("Product", "Product uuid=" + uuid + " not found"));
        return mapper.mapToProductReadOnlyDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductReadOnlyDTO> getProductsPaginatedFiltered(Pageable pageable, ProductFilters filters)
            throws EntityNotFoundException {

        if (filters.getUuid() != null) {
            Product product = productRepository.findByUuidAndDeletedFalse(filters.getUuid())
                    .orElseThrow(() -> new EntityNotFoundException("Product", "uuid=" + filters.getUuid() + " not found"));
            return new PageImpl<>(List.of(mapper.mapToProductReadOnlyDTO(product)), pageable, 1);
        }

        Page<Product> page = productRepository.findAll(ProductSpecification.build(filters), pageable);
        return page.map(mapper::mapToProductReadOnlyDTO);
    }

    private void applyQuantityChange(Product product, BigDecimal newQuantity, QuantityChangeReason reason)
            throws EntityInvalidArgumentException {
        BigDecimal previous = product.getQuantityKg();
        if (previous.compareTo(newQuantity) == 0) {
            return;
        }
        if (reason == null) {
            throw new EntityInvalidArgumentException(
                    "Product",
                    "A quantity change reason is required when updating product quantity");
        }

        productQuantityChangeRepository.save(
                new ProductQuantityChange(product, previous, newQuantity, reason));
        product.setQuantityKg(newQuantity);
    }
}
