package com.honeyapp.mapper;

import com.honeyapp.dto.*;
import com.honeyapp.model.*;
import org.springframework.stereotype.Component;

@Component
public class Mapper {

    public ProducerReadOnlyDTO mapToProducerReadOnlyDTO(Producer producer) {
        BusinessInfo info = producer.getBusinessInfo();
        return new ProducerReadOnlyDTO(
                producer.getUuid().toString(),
                producer.getBusinessName(),
                producer.getOwnerFirstname(),
                producer.getOwnerLastname(),
                producer.getVat(),
                producer.getRegion() != null ? producer.getRegion().getName() : null,
                producer.getDescription(),
                info != null ? info.getAddress() : null,
                info != null ? info.getPhone() : null,
                info != null ? info.getOrganicCertNumber() : null
        );
    }

    public Producer mapToProducerEntity(ProducerInsertDTO dto) {
        Producer producer = new Producer();
        producer.setBusinessName(dto.businessName());
        producer.setOwnerFirstname(dto.ownerFirstname());
        producer.setOwnerLastname(dto.ownerLastname());
        producer.setVat(dto.vat());
        producer.setDescription(dto.description());

        User user = new User();
        user.setUsername(dto.userInsertDTO().username());
        user.setPassword(dto.userInsertDTO().password());
        producer.addUser(user);

        BusinessInfoInsertDTO infoDto = dto.businessInfoInsertDTO();
        BusinessInfo businessInfo = new BusinessInfo();
        businessInfo.setTaxId(infoDto.taxId());
        businessInfo.setAddress(infoDto.address());
        businessInfo.setPhone(infoDto.phone());
        businessInfo.setOrganicCertNumber(infoDto.organicCertNumber());
        producer.setBusinessInfo(businessInfo);

        return producer;
    }

    public Consumer mapToConsumerEntity(ConsumerInsertDTO dto) {
        Consumer consumer = new Consumer();
        consumer.setFirstname(dto.firstname());
        consumer.setLastname(dto.lastname());
        consumer.setAddress(dto.address());
        consumer.setPhone(dto.phone());

        User user = new User();
        user.setUsername(dto.userInsertDTO().username());
        user.setPassword(dto.userInsertDTO().password());
        consumer.addUser(user);

        return consumer;
    }

    public ConsumerReadOnlyDTO mapToConsumerReadOnlyDTO(Consumer consumer) {
        return new ConsumerReadOnlyDTO(
                consumer.getUuid().toString(),
                consumer.getFirstname(),
                consumer.getLastname(),
                consumer.getAddress(),
                consumer.getPhone()
        );
    }

    public ProductReadOnlyDTO mapToProductReadOnlyDTO(Product product) {
        Producer producer = product.getProducer();
        return new ProductReadOnlyDTO(
                product.getUuid().toString(),
                product.getName(),
                product.getHoneyType(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantityKg(),
                product.getHarvestYear(),
                producer.getUuid().toString(),
                producer.getBusinessName(),
                producer.getRegion() != null ? producer.getRegion().getName() : null
        );
    }

    public Product mapToProductEntity(ProductInsertDTO dto, Producer producer) {
        Product product = new Product();
        product.setName(dto.name());
        product.setHoneyType(dto.honeyType());
        product.setDescription(dto.description());
        product.setPrice(dto.price());
        product.setQuantityKg(dto.quantityKg());
        product.setHarvestYear(dto.harvestYear());
        product.setProducer(producer);
        return product;
    }
}
