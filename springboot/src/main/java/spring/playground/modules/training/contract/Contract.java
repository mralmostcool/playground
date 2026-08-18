package spring.playground.modules.training.contract;

import java.time.OffsetDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import spring.playground.modules.seafarer.enrollment.Enrollment;
import spring.playground.modules.seafarer.indos.IndosMaster;
import spring.playground.modules.shipping.company.Company;
import spring.playground.modules.training.berthSeafarerAllocation.BerthSeafarerAllocation;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contract")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "indos_master_id", nullable = false)
    private IndosMaster indosMaster;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne
    @JoinColumn(name = "enrollment_id", nullable = false)
    private Enrollment enrollment;

    @ManyToOne
    @JoinColumn(name = "berth_seafarer_allocation_id", nullable = false)
    private BerthSeafarerAllocation berthSeafarerAllocation;

    @Enumerated(EnumType.STRING)
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false, columnDefinition = "contract_status")
    @Builder.Default
    private ContractStatus status = ContractStatus.DRAFT;

    @Column(name = "sign_on_date", nullable = false)
    private OffsetDateTime signOnDate;

    @Column(name = "sign_on_port", nullable = false, length = 128)
    private String signOnPort;

    @Column(name = "sign_on_country", nullable = false, length = 128)
    private String signOnCountry;

    @Column(name = "sign_off_date", nullable = false)
    private OffsetDateTime signOffDate;

    @Column(name = "sign_off_port", nullable = false, length = 128)
    private String signOffPort;

    @Column(name = "sign_off_country", nullable = false, length = 128)
    private String signOffCountry;

    @Column(name = "actual_sign_on_date")
    private OffsetDateTime actualSignOnDate;

    @Column(name = "actual_sign_on_port", length = 128)
    private String actualSignOnPort;

    @Column(name = "actual_sign_on_country", length = 128)
    private String actualSignOnCountry;

    @Column(name = "actual_sign_off_date")
    private OffsetDateTime actualSignOffDate;

    @Column(name = "actual_sign_off_port", length = 128)
    private String actualSignOffPort;

    @Column(name = "actual_sign_off_country", length = 128)
    private String actualSignOffCountry;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public enum ContractStatus {
        DRAFT,
        ACTIVE,
        COMPLETED,
        TERMINATED
    }
}
