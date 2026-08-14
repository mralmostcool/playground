package spring.playground.modules.training.contract;

import java.time.OffsetDateTime;
import java.util.UUID;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import spring.playground.modules.training.contract.Contract.ContractStatus;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractRequestDTO {

    @NotNull(message = "INDoS master ID is required")
    private UUID indosMasterId;

    @NotNull(message = "Company ID is required")
    private UUID companyId;

    @NotNull(message = "Enrollment ID is required")
    private UUID enrollmentId;

    @NotNull(message = "Berth seafarer allocation ID is required")
    private UUID berthSeafarerAllocationId;

    @Builder.Default
    private ContractStatus status = ContractStatus.DRAFT;

    @NotNull(message = "Sign on date is required")
    private OffsetDateTime signOnDate;

    @NotBlank(message = "Sign on port is required")
    @Size(max = 128, message = "Sign on port must not exceed 128 characters")
    private String signOnPort;

    @NotBlank(message = "Sign on country is required")
    @Size(max = 128, message = "Sign on country must not exceed 128 characters")
    private String signOnCountry;

    @NotNull(message = "Sign off date is required")
    private OffsetDateTime signOffDate;

    @NotBlank(message = "Sign off port is required")
    @Size(max = 128, message = "Sign off port must not exceed 128 characters")
    private String signOffPort;

    @NotBlank(message = "Sign off country is required")
    @Size(max = 128, message = "Sign off country must not exceed 128 characters")
    private String signOffCountry;

    private OffsetDateTime actualSignOnDate;

    @Size(max = 128, message = "Actual sign on port must not exceed 128 characters")
    private String actualSignOnPort;

    @Size(max = 128, message = "Actual sign on country must not exceed 128 characters")
    private String actualSignOnCountry;

    private OffsetDateTime actualSignOffDate;

    @Size(max = 128, message = "Actual sign off port must not exceed 128 characters")
    private String actualSignOffPort;

    @Size(max = 128, message = "Actual sign off country must not exceed 128 characters")
    private String actualSignOffCountry;

    private String remarks;
}
