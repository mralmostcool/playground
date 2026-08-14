package spring.playground.modules.audit;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "audit_logs")
public class AuditLogs {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "table_name", nullable = false, length = 100)
    private String tableName;

    @Column(name = "operation", nullable = false, length = 10)
    private String operation;

    @Column(name = "record_id", nullable = false)
    private UUID recordId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "old_values")
    private String oldValues;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "new_values")
    private String newValues;

    @Column(name = "changed_by")
    private UUID changedBy;

    @Column(name = "changed_at")
    private OffsetDateTime changedAt;

    @PrePersist
    void onCreate() {
        this.changedAt = OffsetDateTime.now();
    }

}
