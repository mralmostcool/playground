package spring.playground.modules.shipping.vessel;

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
public class VesselPatchRequestDTO {

    @Size(min = 1, max = 10, message = "IMO must be between 1 and 10 characters if provided")
    private String imo;

    @Size(min = 1, max = 128, message = "Vessel name must be between 1 and 128 characters if provided")
    private String name;

    @Size(min = 1, max = 64, message = "Flag must be between 1 and 64 characters if provided")
    private String flag;

    private Boolean isActive;
}
