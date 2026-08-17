package spring.playground.modules.course;

import java.time.LocalDate;
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
public class PreSeaCoursesPatchRequestDTO {

    @Size(min = 1, max = 255, message = "Course name must be between 1 and 255 characters if provided")
    private String name;

    private Boolean isActive;

    private LocalDate startDate;

    private UUID instituteId;
}
