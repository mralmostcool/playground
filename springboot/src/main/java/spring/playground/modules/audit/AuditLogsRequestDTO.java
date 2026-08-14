package spring.playground.modules.audit;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class AuditLogsRequestDTO {

    @NotBlank(message = "Table name is required")
    @Size(max = 100, message = "Table name must not exceed 100 characters")
    private String tableName;

    @NotBlank(message = "Operation is required")
    @Size(max = 10, message = "Operation must not exceed 10 characters")
    private String operation;

    @NotNull(message = "Record ID is required")
    private UUID recordId;

    private String oldValues;

    private String newValues;

    private UUID changedBy;
}
