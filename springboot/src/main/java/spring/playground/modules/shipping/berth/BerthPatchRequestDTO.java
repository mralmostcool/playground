package spring.playground.modules.shipping.berth;

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
public class BerthPatchRequestDTO {

    @Size(min = 1, max = 128, message = "Berth name must be between 1 and 128 characters if provided")
    private String berthName;

    private Boolean isActive;
}
