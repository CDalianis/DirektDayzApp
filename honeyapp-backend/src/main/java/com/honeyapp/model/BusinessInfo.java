package com.honeyapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "business_information")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BusinessInfo extends AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tax_id")
    private String taxId;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(name = "organic_cert_number")
    private String organicCertNumber;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "certification_file_id", unique = true)
    private Attachment certificationFile;

    public void addCertificationFile(Attachment attachment) {
        this.certificationFile = attachment;
    }

    public void removeCertificationFile() {
        this.certificationFile = null;
    }
}
