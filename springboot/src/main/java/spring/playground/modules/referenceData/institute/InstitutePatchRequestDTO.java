package spring.playground.modules.referenceData.institute;

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
public class InstitutePatchRequestDTO {

    @Size(min = 1, max = 255, message = "Institute name must be between 1 and 255 characters if provided")
    private String name;
}
