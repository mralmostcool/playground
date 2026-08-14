package spring.playground.modules.referenceData.rank;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class RankMasterRequestDTO {

    @NotBlank(message = "Rank name is required")
    @Size(max = 64, message = "Rank name must not exceed 64 characters")
    private String name;

    @NotNull(message = "Level is required")
    private Integer level;
}
