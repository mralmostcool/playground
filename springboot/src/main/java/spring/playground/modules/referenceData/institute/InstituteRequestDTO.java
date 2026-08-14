package spring.playground.modules.referenceData.institute;

import jakarta.validation.constraints.NotBlank;
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
public class InstituteRequestDTO {

    @NotBlank(message = "Institute name is required")
    @Size(max = 255, message = "Institute name must not exceed 255 characters")
    private String name;
}
