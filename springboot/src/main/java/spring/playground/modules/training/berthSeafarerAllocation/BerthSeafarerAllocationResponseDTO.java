package spring.playground.modules.training.berthSeafarerAllocation;

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
public class BerthSeafarerAllocationResponseDTO {

    private UUID id;
    private UUID berthId;
    private UUID indosMasterId;
    private UUID berthAllocationId;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
