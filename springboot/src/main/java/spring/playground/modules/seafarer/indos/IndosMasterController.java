package spring.playground.modules.seafarer.indos;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/indos")
@RequiredArgsConstructor
public class IndosMasterController {

    private final IndosMasterServices indosMasterServices;

    @PostMapping
    public ResponseEntity<IndosMasterResponseDTO> createIndos(@Valid @RequestBody IndosMasterRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(indosMasterServices.createIndos(requestDTO));
    }

    @GetMapping
    public ResponseEntity<List<IndosMasterResponseDTO>> getAllIndos() {
        return ResponseEntity.ok(indosMasterServices.getAllIndos());
    }

    @GetMapping("/page")
    public ResponseEntity<Page<IndosMasterResponseDTO>> getIndosPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(indosMasterServices.getIndosPaginated(page, size, search));
    }

    @GetMapping("/by-indos/{indos}")
    public ResponseEntity<IndosMasterResponseDTO> getIndosByIndos(@PathVariable String indos) {
        return ResponseEntity.ok(indosMasterServices.getIndosByIndos(indos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IndosMasterResponseDTO> getIndosById(@PathVariable UUID id) {
        return ResponseEntity.ok(indosMasterServices.getIndosById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IndosMasterResponseDTO> updateIndos(
            @PathVariable UUID id,
            @Valid @RequestBody IndosMasterRequestDTO requestDTO) {
        return ResponseEntity.ok(indosMasterServices.updateIndos(id, requestDTO));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<IndosMasterResponseDTO> patchIndos(
            @PathVariable UUID id,
            @Valid @RequestBody IndosMasterPatchRequestDTO requestDTO) {
        return ResponseEntity.ok(indosMasterServices.patchIndos(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIndos(@PathVariable UUID id) {
        indosMasterServices.deleteIndos(id);
        return ResponseEntity.noContent().build();
    }
}
