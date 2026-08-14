package spring.playground.modules.shipping.vessel;

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
public class VesselRequestDTO {

    @NotBlank(message = "IMO is required")
    @Size(max = 10, message = "IMO must not exceed 10 characters")
    private String imo;

    @NotBlank(message = "Vessel name is required")
    @Size(max = 128, message = "Vessel name must not exceed 128 characters")
    private String name;

    @NotBlank(message = "Flag is required")
    @Size(max = 64, message = "Flag must not exceed 64 characters")
    private String flag;

    @NotNull(message = "Is active status is required")
    @Builder.Default
    private Boolean isActive = true;
}
