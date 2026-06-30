package com.honeyapp.security;

import com.honeyapp.model.User;
import com.honeyapp.repository.ConsumerRepository;
import com.honeyapp.repository.ProducerRepository;
import com.honeyapp.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service("securityService")
@RequiredArgsConstructor
public class SecurityService {

    private final ProducerRepository producerRepository;
    private final ProductRepository productRepository;
    private final ConsumerRepository consumerRepository;

    public boolean isOwnProducerProfile(UUID producerUuid, Authentication authentication) {
        User principal = (User) authentication.getPrincipal();
        return producerRepository.existsByUuidAndUser_Uuid(producerUuid, principal.getUuid());
    }

    public boolean isOwnProduct(UUID productUuid, Authentication authentication) {
        User principal = (User) authentication.getPrincipal();
        return productRepository.findByUuidAndDeletedFalse(productUuid)
                .map(product -> product.getProducer().getUser().getUuid().equals(principal.getUuid()))
                .orElse(false);
    }

    public boolean isOwnConsumerProfile(UUID consumerUuid, Authentication authentication) {
        User principal = (User) authentication.getPrincipal();
        return consumerRepository.existsByUuidAndUser_Uuid(consumerUuid, principal.getUuid());
    }
}
