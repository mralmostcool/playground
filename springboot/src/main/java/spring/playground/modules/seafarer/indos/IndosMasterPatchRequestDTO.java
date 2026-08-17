package spring.playground.modules.seafarer.indos;

import java.util.UUID;
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
public class IndosMasterPatchRequestDTO {

    @Size(min = 7, max = 7, message = "INDoS number must be exactly 7 characters if provided")
    private String indos;

    @Size(min = 1, max = 255, message = "First name must be between 1 and 255 characters if provided")
    private String firstName;

    private UUID rankId;

    private Boolean isActive;
}
