package spring.playground.modules.referenceData.rank;

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
public class RankMasterResponseDTO {

    private UUID id;
    private String name;
    private int level;
    private OffsetDateTime createdAt;
}
