package spring.playground.modules.shipping.company;

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
public class CompanyPatchRequestDTO {

    @Size(min = 1, max = 255, message = "Company name must be between 1 and 255 characters if provided")
    private String name;

    @Size(min = 1, max = 64, message = "Registration number must be between 1 and 64 characters if provided")
    private String registrationNo;

    private Boolean isActive;
}
