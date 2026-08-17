package spring.playground.modules.seafarer.enrollment;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentServices enrollmentServices;

    @PostMapping
    public ResponseEntity<EnrollmentResponseDTO> createEnrollment(@Valid @RequestBody EnrollmentRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enrollmentServices.createEnrollment(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<EnrollmentResponseDTO>> getAllEnrollments() {
        return ResponseEntity.ok(enrollmentServices.getAllEnrollments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentResponseDTO> getEnrollmentById(@PathVariable UUID id) {
        return ResponseEntity.ok(enrollmentServices.getEnrollmentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnrollmentResponseDTO> updateEnrollment(
            @PathVariable UUID id,
            @Valid @RequestBody EnrollmentRequestDTO requestDTO) {
        return ResponseEntity.ok(enrollmentServices.updateEnrollment(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EnrollmentResponseDTO> patchEnrollment(
            @PathVariable UUID id,
            @Valid @RequestBody EnrollmentPatchRequestDTO requestDTO) {
        return ResponseEntity.ok(enrollmentServices.patchEnrollment(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable UUID id) {
        enrollmentServices.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }
}
