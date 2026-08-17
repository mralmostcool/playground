package spring.playground.modules.course;

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
@RequestMapping("/api/pre-sea-courses")
@RequiredArgsConstructor
public class PreSeaCoursesController {

    private final PreSeaCoursesServices preSeaCoursesServices;

    @PostMapping
    public ResponseEntity<PreSeaCoursesResponseDTO> createCourse(@Valid @RequestBody PreSeaCoursesRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(preSeaCoursesServices.createCourse(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<PreSeaCoursesResponseDTO>> getAllCourses() {
        return ResponseEntity.ok(preSeaCoursesServices.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PreSeaCoursesResponseDTO> getCourseById(@PathVariable UUID id) {
        return ResponseEntity.ok(preSeaCoursesServices.getCourseById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PreSeaCoursesResponseDTO> updateCourse(
            @PathVariable UUID id,
            @Valid @RequestBody PreSeaCoursesRequestDTO requestDTO) {
        return ResponseEntity.ok(preSeaCoursesServices.updateCourse(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PreSeaCoursesResponseDTO> patchCourse(
            @PathVariable UUID id,
            @Valid @RequestBody PreSeaCoursesPatchRequestDTO requestDTO) {
        return ResponseEntity.ok(preSeaCoursesServices.patchCourse(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID id) {
        preSeaCoursesServices.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
}
