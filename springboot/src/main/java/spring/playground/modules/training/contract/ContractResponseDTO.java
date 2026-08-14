package spring.playground.modules.training.contract;

import java.time.OffsetDateTime;
import java.util.UUID;

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
public class ContractResponseDTO {

    private UUID id;
    private UUID indosMasterId;
    private UUID companyId;
    private UUID enrollmentId;
    private UUID berthSeafarerAllocationId;
    private ContractStatus status;
    private OffsetDateTime signOnDate;
    private String signOnPort;
    private String signOnCountry;
    private OffsetDateTime signOffDate;
    private String signOffPort;
    private String signOffCountry;
    private OffsetDateTime actualSignOnDate;
    private String actualSignOnPort;
    private String actualSignOnCountry;
    private OffsetDateTime actualSignOffDate;
    private String actualSignOffPort;
    private String actualSignOffCountry;
    private String remarks;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
