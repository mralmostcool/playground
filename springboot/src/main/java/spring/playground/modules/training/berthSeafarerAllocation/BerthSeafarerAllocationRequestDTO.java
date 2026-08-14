package spring.playground.modules.training.berthSeafarerAllocation;

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
public class BerthSeafarerAllocationRequestDTO {

    @NotNull(message = "Berth ID is required")
    private UUID berthId;

    @NotNull(message = "INDoS master ID is required")
    private UUID indosMasterId;

    private UUID berthAllocationId;

    @NotNull(message = "Start date is required")
    private OffsetDateTime startDate;

    @NotNull(message = "End date is required")
    private OffsetDateTime endDate;
}
