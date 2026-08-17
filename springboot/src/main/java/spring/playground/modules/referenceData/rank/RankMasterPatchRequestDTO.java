package spring.playground.modules.referenceData.rank;

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
public class RankMasterPatchRequestDTO {

    @Size(min = 1, max = 64, message = "Rank name must be between 1 and 64 characters if provided")
    private String name;

    private Integer level;
}
