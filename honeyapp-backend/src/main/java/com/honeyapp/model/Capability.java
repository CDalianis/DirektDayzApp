package com.honeyapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "capabilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Capability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String description;

    @Getter(AccessLevel.PROTECTED)
    @Setter(AccessLevel.NONE)
    @ManyToMany(mappedBy = "capabilities", fetch = FetchType.LAZY)
    private Set<Role> roles = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Capability that)) return false;
        return Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(name);
    }
}
