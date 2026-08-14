package spring.playground.modules.shipping.berthAllocation;

import java.time.OffsetDateTime;
import java.util.UUID;
import jakarta.validation.constraints.NotNull;
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
public class BerthAllocationRequestDTO {

    @NotNull(message = "Berth ID is required")
    private UUID berthId;

    @NotNull(message = "Vessel ID is required")
    private UUID vesselId;

    @NotNull(message = "Start date is required")
    private OffsetDateTime startDate;

    @NotNull(message = "End date is required")
    private OffsetDateTime endDate;
}
