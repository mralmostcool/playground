package spring.playground.modules.seafarer.enrollment;

import java.util.UUID;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import spring.playground.modules.seafarer.enrollment.Enrollment.EnrollmentStatus;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequestDTO {

    @NotNull(message = "Pre-sea course ID is required")
    private UUID preSeaCourseId;

    @NotNull(message = "INDoS master ID is required")
    private UUID indosMasterId;

    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.ENROLLED;

    private String remarks;
}
