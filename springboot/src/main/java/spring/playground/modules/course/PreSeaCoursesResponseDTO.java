package spring.playground.modules.course;

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
public class PreSeaCoursesResponseDTO {

    private UUID id;
    private String name;
    private Boolean isActive;
    private OffsetDateTime startDate;
    private UUID instituteId;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
