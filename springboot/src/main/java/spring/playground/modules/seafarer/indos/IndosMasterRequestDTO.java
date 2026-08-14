package spring.playground.modules.seafarer.indos;

import java.util.UUID;
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
public class IndosMasterRequestDTO {

    @NotBlank(message = "INDoS number is required")
    @Size(min = 7, max = 7, message = "INDoS number must be exactly 7 characters")
    private String indos;

    @NotBlank(message = "First name is required")
    @Size(max = 255, message = "First name must not exceed 255 characters")
    private String firstName;

    @NotNull(message = "Rank ID is required")
    private UUID rankId;

    @NotNull(message = "Is active status is required")
    private Boolean isActive;
}
