package com.honeyapp.service;

import com.honeyapp.core.exceptions.EntityNotFoundException;
import com.honeyapp.core.filters.ProductFilters;
import com.honeyapp.dto.ProductInsertDTO;
import com.honeyapp.dto.ProductReadOnlyDTO;
import com.honeyapp.dto.ProductUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IProductService {
    ProductReadOnlyDTO saveProduct(ProductInsertDTO dto) throws EntityNotFoundException;

    ProductReadOnlyDTO updateProduct(ProductUpdateDTO dto) throws EntityNotFoundException;

    ProductReadOnlyDTO deleteProductByUuid(UUID uuid) throws EntityNotFoundException;

    ProductReadOnlyDTO getProductByUuidDeletedFalse(UUID uuid) throws EntityNotFoundException;

    Page<ProductReadOnlyDTO> getProductsPaginatedFiltered(Pageable pageable, ProductFilters filters)
            throws EntityNotFoundException;
}
