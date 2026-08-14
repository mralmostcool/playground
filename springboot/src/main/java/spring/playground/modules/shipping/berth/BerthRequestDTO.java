package spring.playground.modules.shipping.berth;

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
public class BerthRequestDTO {

    @NotBlank(message = "Berth name is required")
    @Size(max = 128, message = "Berth name must not exceed 128 characters")
    private String berthName;

    @NotNull(message = "Is active status is required")
    @Builder.Default
    private Boolean isActive = true;
}
