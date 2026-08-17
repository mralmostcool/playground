package spring.playground.modules.referenceData.institute;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/institutes")
public class InstituteController {

    private final InstituteServices instituteServices;

    @PostMapping
    public ResponseEntity<InstituteResponseDTO> createInstitute(@Valid @RequestBody InstituteRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(instituteServices.createInstitute(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<InstituteResponseDTO>> getAllInstitutes() {
        return ResponseEntity.ok(instituteServices.getAllInstitutes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstituteResponseDTO> getInstituteById(@PathVariable UUID id) {
        return ResponseEntity.ok(instituteServices.getInstituteById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstituteResponseDTO> updateInstitute(@PathVariable UUID id,
            @Valid @RequestBody InstituteRequestDTO requestDTO) {
        return ResponseEntity.ok(instituteServices.updateInstitute(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<InstituteResponseDTO> patchInstitute(@PathVariable UUID id,
            @Valid @RequestBody InstitutePatchRequestDTO requestDTO) {
        return ResponseEntity.ok(instituteServices.patchInstitute(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstitute(
            @PathVariable UUID id) {
        instituteServices.deleteInstitute(id);
        return ResponseEntity.noContent().build();
    }

}
