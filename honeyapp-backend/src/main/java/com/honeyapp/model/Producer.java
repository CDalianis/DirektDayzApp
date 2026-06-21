package com.honeyapp.model;

import com.honeyapp.model.staticdata.Region;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "producers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producer extends AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, updatable = false)
    private UUID uuid;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(name = "owner_firstname", nullable = false)
    private String ownerFirstname;

    @Column(name = "owner_lastname", nullable = false)
    private String ownerLastname;

    @Column(unique = true)
    private String vat;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "business_info_id")
    private BusinessInfo businessInfo;

    @OneToMany(mappedBy = "producer", fetch = FetchType.LAZY)
    private Set<Product> products = new HashSet<>();

    @PrePersist
    public void initializeUuid() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }

    public void addUser(User user) {
        this.user = user;
        user.setProducer(this);
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Producer producer)) return false;
        return Objects.equals(uuid, producer.uuid);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(uuid);
    }
}
