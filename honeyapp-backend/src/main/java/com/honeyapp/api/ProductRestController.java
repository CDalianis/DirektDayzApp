package com.honeyapp.api;

import com.honeyapp.core.exceptions.EntityInvalidArgumentException;
import com.honeyapp.core.exceptions.EntityNotFoundException;
import com.honeyapp.core.exceptions.ValidationException;
import com.honeyapp.core.filters.ProductFilters;
import com.honeyapp.dto.ProductInsertDTO;
import com.honeyapp.dto.ProductReadOnlyDTO;
import com.honeyapp.dto.ProductUpdateDTO;
import com.honeyapp.service.IProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductRestController {

    private final IProductService productService;

    @PostMapping
    public ResponseEntity<ProductReadOnlyDTO> saveProduct(
            @Valid @RequestBody ProductInsertDTO dto,
            BindingResult bindingResult) throws EntityNotFoundException, ValidationException {

        if (bindingResult.hasErrors()) {
            throw new ValidationException("Product", "Invalid product data", bindingResult);
        }

        ProductReadOnlyDTO saved = productService.saveProduct(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{uuid}")
                .buildAndExpand(saved.uuid())
                .toUri();
        return ResponseEntity.created(location).body(saved);
    }

    @PutMapping("/{uuid}")
    public ResponseEntity<ProductReadOnlyDTO> updateProduct(
            @PathVariable UUID uuid,
            @Valid @RequestBody ProductUpdateDTO dto,
            BindingResult bindingResult)
            throws EntityNotFoundException, ValidationException, EntityInvalidArgumentException {

        if (!uuid.equals(dto.uuid())) {
            throw new EntityInvalidArgumentException("Product", "Path uuid does not match body uuid");
        }
        if (bindingResult.hasErrors()) {
            throw new ValidationException("Product", "Invalid product data", bindingResult);
        }
        return ResponseEntity.ok(productService.updateProduct(dto));
    }

    @GetMapping
    public ResponseEntity<Page<ProductReadOnlyDTO>> getProducts(
            @PageableDefault(page = 0, size = 12) Pageable pageable,
            @ModelAttribute ProductFilters filters) throws EntityNotFoundException {
        return ResponseEntity.ok(productService.getProductsPaginatedFiltered(pageable, filters));
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<ProductReadOnlyDTO> getProduct(@PathVariable UUID uuid)
            throws EntityNotFoundException {
        return ResponseEntity.ok(productService.getProductByUuidDeletedFalse(uuid));
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<ProductReadOnlyDTO> deleteProduct(@PathVariable UUID uuid)
            throws EntityNotFoundException {
        return ResponseEntity.ok(productService.deleteProductByUuid(uuid));
    }
}
