package com.honeyapp.specification;

import com.honeyapp.core.filters.ProductFilters;
import com.honeyapp.model.Product;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class ProductSpecification {

    public static Specification<Product> build(ProductFilters filters) {
        return Specification.allOf(
                hasHoneyType(filters.getHoneyType()),
                hasName(filters.getName()),
                hasRegion(filters.getRegion()),
                hasProducerUuid(filters.getProducerUuid()),
                isDeleted(filters.isDeleted())
        );
    }

    private static Specification<Product> hasHoneyType(com.honeyapp.model.HoneyType honeyType) {
        return (root, query, cb) -> honeyType == null ? cb.conjunction() :
                cb.equal(root.get("honeyType"), honeyType);
    }

    private static Specification<Product> hasName(String name) {
        return (root, query, cb) -> name == null ? cb.conjunction() :
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    private static Specification<Product> hasRegion(String region) {
        return (root, query, cb) -> region == null ? cb.conjunction() :
                cb.equal(cb.lower(root.get("producer").get("region").get("name")), region.toLowerCase());
    }

    private static Specification<Product> hasProducerUuid(UUID producerUuid) {
        return (root, query, cb) -> producerUuid == null ? cb.conjunction() :
                cb.equal(root.get("producer").get("uuid"), producerUuid);
    }

    private static Specification<Product> isDeleted(boolean deleted) {
        return (root, query, cb) -> cb.equal(root.get("deleted"), deleted);
    }
}
