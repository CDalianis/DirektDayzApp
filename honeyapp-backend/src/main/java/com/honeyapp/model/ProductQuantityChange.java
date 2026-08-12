package com.honeyapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "product_quantity_changes")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class ProductQuantityChange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "previous_quantity_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal previousQuantityKg;

    @Column(name = "new_quantity_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal newQuantityKg;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private QuantityChangeReason reason;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public ProductQuantityChange(
            Product product,
            BigDecimal previousQuantityKg,
            BigDecimal newQuantityKg,
            QuantityChangeReason reason) {
        this.product = product;
        this.previousQuantityKg = previousQuantityKg;
        this.newQuantityKg = newQuantityKg;
        this.reason = reason;
    }
}
