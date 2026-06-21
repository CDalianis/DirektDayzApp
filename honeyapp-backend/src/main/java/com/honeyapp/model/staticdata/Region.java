package com.honeyapp.model.staticdata;

import com.honeyapp.model.Producer;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "regions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Getter(AccessLevel.PROTECTED)
    @Setter(AccessLevel.PRIVATE)
    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    private Set<Producer> producers = new HashSet<>();

    public Set<Producer> getAllProducers() {
        return Collections.unmodifiableSet(producers);
    }

    public void addProducer(Producer producer) {
        if (producers == null) {
            producers = new HashSet<>();
        }
        producers.add(producer);
        producer.setRegion(this);
    }

    public void removeProducer(Producer producer) {
        if (producers == null) {
            return;
        }
        producers.remove(producer);
        producer.setRegion(null);
    }
}
