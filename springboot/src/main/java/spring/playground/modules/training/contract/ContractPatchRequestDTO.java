package spring.playground.modules.training.contract;

import java.time.OffsetDateTime;
import java.util.UUID;
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
public class ContractPatchRequestDTO {

    private UUID indosMasterId;

    private UUID companyId;

    private UUID enrollmentId;

    private UUID berthSeafarerAllocationId;

    private ContractStatus status;

    private OffsetDateTime signOnDate;

    @Size(max = 128, message = "Sign on port must not exceed 128 characters")
    private String signOnPort;

    @Size(max = 128, message = "Sign on country must not exceed 128 characters")
    private String signOnCountry;

    private OffsetDateTime signOffDate;

    @Size(max = 128, message = "Sign off port must not exceed 128 characters")
    private String signOffPort;

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
