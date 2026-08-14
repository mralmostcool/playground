package spring.playground.modules.audit;

import java.time.OffsetDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogsResponseDTO {

    private UUID id;
    private String tableName;
    private String operation;
    private UUID recordId;
    private String oldValues;
    private String newValues;
    private UUID changedBy;
    private OffsetDateTime changedAt;
}
