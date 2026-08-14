package spring.playground.modules.seafarer.enrollment;

import java.time.OffsetDateTime;
import java.util.UUID;

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
public class EnrollmentResponseDTO {

    private UUID id;
    private UUID preSeaCourseId;
    private UUID indosMasterId;
    private EnrollmentStatus status;
    private String remarks;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
