package spring.playground.modules.shipping.berthAllocation;

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
public class BerthAllocationResponseDTO {

    private UUID id;
    private UUID berthId;
    private UUID vesselId;
    private OffsetDateTime startDate;
    private OffsetDateTime endDate;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
