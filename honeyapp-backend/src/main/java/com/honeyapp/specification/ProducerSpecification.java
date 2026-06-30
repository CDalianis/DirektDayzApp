package com.honeyapp.specification;

import com.honeyapp.core.filters.ProducerFilters;
import com.honeyapp.model.Producer;
import org.springframework.data.jpa.domain.Specification;

public class ProducerSpecification {

    public static Specification<Producer> build(ProducerFilters filters) {
        return Specification.allOf(
                hasBusinessName(filters.getBusinessName()),
                hasRegion(filters.getRegion()),
                isDeleted(filters.isDeleted())
        );
    }

    private static Specification<Producer> hasBusinessName(String businessName) {
        return (root, query, cb) -> businessName == null ? cb.conjunction() :
                cb.like(cb.lower(root.get("businessName")), businessName.toLowerCase() + "%");
    }

    private static Specification<Producer> hasRegion(String region) {
        return (root, query, cb) -> region == null ? cb.conjunction() :
                cb.equal(cb.lower(root.get("region").get("name")), region.toLowerCase());
    }

    private static Specification<Producer> isDeleted(boolean deleted) {
        return (root, query, cb) -> cb.equal(root.get("deleted"), deleted);
    }
}
